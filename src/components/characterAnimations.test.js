import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { AnimationMixer, Group, Object3D, Vector3 } from 'three';
import { FBXLoader } from 'three-stdlib';
import { createGestureClips } from './characterAnimations.js';
import { stageCameraDistance, workstation } from './characterStageLayout.js';

// Read the real rig without loading image textures or requiring a WebGL context.
function loadRig() {
  const bytes = readFileSync(new URL('../../public/models/6490f6229837221882d60895-2.glb', import.meta.url));
  const model = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
  const nodes = model.nodes.map(node => {
    const object = new Object3D(); object.name = node.name;
    if (node.translation) object.position.fromArray(node.translation);
    if (node.rotation) object.quaternion.fromArray(node.rotation);
    if (node.scale) object.scale.fromArray(node.scale);
    return object;
  });
  model.nodes.forEach((node, index) => node.children?.forEach(child => nodes[index].add(nodes[child])));
  const rig = new Group(); model.scenes[model.scene || 0].nodes.forEach(index => rig.add(nodes[index]));
  return rig;
}

function loadClip(name) {
  const bytes = readFileSync(new URL(`../../public/animations/${name}.fbx`, import.meta.url));
  return new FBXLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '').animations[0];
}

test('keyboard and seat fit the actual typing motion', () => {
  const rig = loadRig(); const clip = loadClip('Typing');
  const mixer = new AnimationMixer(rig); mixer.clipAction(clip).play();
  const center = new Vector3(...workstation.desk).add(new Vector3(...workstation.laptop)).add(new Vector3(...workstation.keyboard.offset));
  for (let time = 0; time < clip.duration; time += .1) {
    mixer.setTime(time); rig.updateMatrixWorld(true);
    const hips = rig.getObjectByName('Hips').getWorldPosition(new Vector3());
    assert(Math.abs(hips.z - workstation.seat[2]) < .075, 'seat should support the pelvis');
    for (const side of ['Left', 'Right']) {
      const finger = rig.getObjectByName(`${side}HandIndex4`).getWorldPosition(new Vector3());
      assert(Math.abs(finger.x - center.x) < workstation.keyboard.width / 2 + .025, 'fingers should remain over keyboard width');
      assert(Math.abs(finger.z - center.z) < workstation.keyboard.depth / 2 + .025, 'keyboard should sit under the fingertips');
      assert(finger.y > center.y - .02, 'fingertips should not penetrate the laptop');
    }
  }
});

test('thinking pose keeps the index below the eyes and preserves valid joint rotations', () => {
  const rig = loadRig(); const standing = loadClip('Standing'); const pointing = loadClip('Pointing');
  const originals = JSON.stringify([standing.toJSON(), pointing.toJSON()]);
  const clips = createGestureClips(rig, standing, pointing);
  assert.equal(JSON.stringify([standing.toJSON(), pointing.toJSON()]), originals);
  for (const clip of clips) {
    assert(clip.validate());
    for (const track of clip.tracks) {
      assert([...track.values].every(Number.isFinite));
      if (track.name.endsWith('.quaternion')) for (let i = 0; i < track.values.length; i += 4) {
        assert(Math.abs(Math.hypot(...track.values.slice(i, i + 4)) - 1) < .0001);
      }
    }
  }
  const mixer = new AnimationMixer(rig); mixer.clipAction(clips.find(clip => clip.name === 'Thinking')).play();
  for (let time = 0; time < 6; time += .2) {
    mixer.setTime(time); rig.updateMatrixWorld(true);
    const head = rig.getObjectByName('Head').getWorldPosition(new Vector3());
    const index = rig.getObjectByName('RightHandIndex4').getWorldPosition(new Vector3());
    assert(index.y < head.y + .04 && index.y > head.y - .04);
    assert(index.z > head.z + .1 && index.z < head.z + .18);
    assert(index.x < head.x - .04 && index.x > head.x - .12);
  }
});

test('build framing leaves clearance for a complete rotation on narrow screens', () => {
  for (const aspect of [.65, 1, 1.65, 2]) for (const closeup of [true, false]) {
    const distance = stageCameraDistance('Typing', closeup, aspect);
    const visibleHalfWidthAtFront = (distance - .8) * Math.tan(17 * Math.PI / 180) * aspect;
    assert(visibleHalfWidthAtFront >= .979);
    assert(distance >= 3.3);
  }
});
