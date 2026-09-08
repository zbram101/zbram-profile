import { AnimationClip, AnimationMixer, Matrix4, Quaternion, QuaternionKeyframeTrack, Vector3, VectorKeyframeTrack } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

// Solve in world space, then convert back to the rig's local coordinates.
function pointBone(bone, child, target) {
  const origin = bone.getWorldPosition(new Vector3());
  const from = child.getWorldPosition(new Vector3()).sub(origin).normalize();
  const to = target.clone().sub(origin).normalize();
  const turn = new Quaternion().setFromUnitVectors(from, to);
  const world = bone.getWorldQuaternion(new Quaternion()).premultiply(turn);
  bone.quaternion.copy(bone.parent.getWorldQuaternion(new Quaternion()).invert().multiply(world));
  bone.updateWorldMatrix(false, true);
}

function poseArm(rig, side, target, pole) {
  const arm = rig.getObjectByName(`${side}Arm`);
  const forearm = rig.getObjectByName(`${side}ForeArm`);
  const hand = rig.getObjectByName(`${side}Hand`);
  const origin = arm.getWorldPosition(new Vector3());
  const elbow = forearm.getWorldPosition(new Vector3());
  const wrist = hand.getWorldPosition(new Vector3());
  const upperLength = origin.distanceTo(elbow);
  const lowerLength = elbow.distanceTo(wrist);
  const direction = target.clone().sub(origin);
  const distance = Math.min(direction.length(), upperLength + lowerLength - .001);
  direction.normalize();
  const bend = pole.clone().sub(origin);
  bend.addScaledVector(direction, -bend.dot(direction)).normalize();
  const along = (upperLength ** 2 + distance ** 2 - lowerLength ** 2) / (2 * distance);
  const height = Math.sqrt(Math.max(0, upperLength ** 2 - along ** 2));
  const elbowTarget = origin.clone().addScaledVector(direction, along).addScaledVector(bend, height);
  pointBone(arm, forearm, elbowTarget);
  pointBone(forearm, hand, origin.clone().addScaledVector(direction, distance));
}

export function createGestureClips(scene, standing, pointing) {
  const rig = clone(scene);
  const mixer = new AnimationMixer(rig);
  mixer.clipAction(standing).play();
  // Retain a captured hand shape: extended index, relaxed thumb, curled fingers.
  const thinkingFingers = pointing.tracks.filter(track => /^RightHand.+\.quaternion$/.test(track.name)).map(track => ({
    bone: rig.getObjectByName(track.name.split('.')[0]),
    rotation: new Quaternion().fromArray(track.createInterpolant().evaluate(pointing.duration / 2)),
  }));
  const bindings = standing.tracks.map(track => {
    const [name, property] = track.name.split('.');
    return { track, node: rig.getObjectByName(name), property };
  }).filter(binding => binding.node);
  const makeClip = (name, duration, pose) => {
    const times = [];
    const values = bindings.map(() => []);
    const steps = Math.round(duration * 15);
    for (let index = 0; index <= steps; index++) {
      const time = duration * index / steps;
      mixer.setTime(time % standing.duration);
      rig.updateMatrixWorld(true);
      pose(time);
      times.push(time);
      bindings.forEach(({ node, property }, i) => node[property].toArray(values[i], values[i].length));
    }
    return new AnimationClip(name, duration, bindings.map(({ track, property }, i) => {
      const Track = property === 'quaternion' ? QuaternionKeyframeTrack : VectorKeyframeTrack;
      return new Track(track.name, times, values[i]);
    }));
  };
  const thinking = makeClip('Thinking', 6, time => {
    const head = rig.getObjectByName('Head');
    const hand = rig.getObjectByName('RightHand');
    thinkingFingers.forEach(({ bone, rotation }) => bone.quaternion.copy(rotation));
    rig.updateMatrixWorld(true);
    const fingerDirection = new Vector3(.06, .97, -.22).normalize();
    const across = new Vector3().crossVectors(fingerDirection, new Vector3(1, 0, 0)).normalize();
    const palm = new Vector3().crossVectors(across, fingerDirection).normalize();
    const orientation = new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(across, fingerDirection, palm));
    const fingertip = hand.worldToLocal(rig.getObjectByName('RightHandIndex4').getWorldPosition(new Vector3()));
    const cheek = head.getWorldPosition(new Vector3()).add(new Vector3(-.08, -.005, .12));
    const wrist = cheek.clone().sub(fingertip.applyQuaternion(orientation));
    poseArm(rig, 'Right', wrist, new Vector3(-.38, 1.16, .3));
    hand.quaternion.copy(hand.parent.getWorldQuaternion(new Quaternion()).invert().multiply(orientation));
    head.rotateX(.045 + Math.sin(time * Math.PI / 3) * .02);
    head.rotateZ(-.05);
  });
  const celebrate = makeClip('Celebrate', 3, time => {
    const lift = Math.sin(time * Math.PI * 2) * .045;
    poseArm(rig, 'Right', new Vector3(-.47, 1.88 + lift, .08), new Vector3(-.7, 1.5, .1));
    poseArm(rig, 'Left', new Vector3(.47, 1.88 + lift, .08), new Vector3(.7, 1.5, .1));
    rig.getObjectByName('Head').rotateX(-.045);
  });
  mixer.stopAllAction();
  mixer.uncacheRoot(rig);
  return [thinking, celebrate];
}
