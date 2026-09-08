import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { LoopOnce, LoopRepeat, MathUtils } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { createGestureClips } from './characterAnimations';

export function Avatar({ animation = 'Standing', paused = false, replay = 0, pointer, ...props }) {
  const group = useRef();
  const { scene } = useGLTF('/models/6490f6229837221882d60895-2.glb');
  const typing = useFBX('/animations/Typing.fbx').animations[0];
  const standing = useFBX('/animations/Standing.fbx').animations[0];
  const wave = useFBX('/animations/Wave.fbx').animations[0];
  const pointing = useFBX('/animations/Pointing.fbx').animations[0];
  const character = useMemo(() => {
    const instance = clone(scene);
    instance.traverse(node => {
      if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; }
      // This Three.js version culls against the undeformed geometry. The seated
      // head, eyes, and clothing move outside those bounds during a turn.
      if (node.isSkinnedMesh) node.frustumCulled = false;
    });
    return instance;
  }, [scene]);
  const clips = useMemo(() => [
    ...[[typing, 'Typing'], [standing, 'Standing'], [wave, 'Wave'], [pointing, 'Pointing']].map(([clip, name]) => {
      const copy = clip.clone(); copy.name = name; return copy;
    }),
    ...createGestureClips(scene, standing, pointing),
  ], [scene, typing, standing, wave, pointing]);
  const { actions, mixer } = useAnimations(clips, group);
  const current = useRef();
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const face = useMemo(() => character.getObjectByName('Wolf3D_Head'), [character]);
  const head = useMemo(() => character.getObjectByName('Head'), [character]);
  const gaze = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const action = actions[animation] || actions.Standing;
    if (!action) return;
    const previous = current.current;
    action.reset().setEffectiveWeight(1).setEffectiveTimeScale(animation === 'Wave' ? .8 : 1);
    const gesture = ['Wave', 'Pointing', 'Celebrate'].includes(animation);
    action.setLoop(gesture && animation !== 'Wave' ? LoopOnce : LoopRepeat, animation === 'Wave' ? 3 : Infinity);
    action.clampWhenFinished = gesture;
    action.play();
    if (pausedRef.current) {
      mixer.stopAllAction();
      action.reset().play(); action.time = Math.min(.8, action.getClip().duration * .5);
    } else if (previous && previous !== action) {
      previous.fadeOut(.45); action.fadeIn(.45);
    }
    current.current = action;
    mixer.update(0);
    const settle = event => {
      if (event.action !== action || current.current !== action) return;
      const idle = actions.Standing;
      idle.reset().setLoop(LoopRepeat, Infinity).setEffectiveWeight(1).setEffectiveTimeScale(1).fadeIn(.55).play();
      action.fadeOut(.55); current.current = idle;
    };
    mixer.addEventListener('finished', settle);
    return () => mixer.removeEventListener('finished', settle);
  }, [actions, mixer, animation, replay]);

  // Freeze the mixer so resuming continues the exact pose and blend.
  useLayoutEffect(() => { mixer.timeScale = paused ? 0 : 1; }, [mixer, paused]);
  useEffect(() => () => mixer.stopAllAction(), [mixer]);
  useFrame((_, delta) => {
    if (paused) return;
    const follow = animation !== 'Typing' && animation !== 'Thinking';
    gaze.current.x = MathUtils.damp(gaze.current.x, follow ? (pointer?.current.x || 0) * .16 : 0, 4, delta);
    gaze.current.y = MathUtils.damp(gaze.current.y, follow ? (pointer?.current.y || 0) * .08 : 0, 4, delta);
    head.rotateY(gaze.current.x);
    head.rotateX(gaze.current.y);
    const smile = face.morphTargetDictionary?.mouthSmile;
    if (smile !== undefined) face.morphTargetInfluences[smile] = MathUtils.damp(face.morphTargetInfluences[smile], animation === 'Celebrate' ? .65 : animation === 'Wave' ? .3 : .12, 4, delta);
  });
  return <group ref={group} {...props} dispose={null}><primitive object={character} /></group>;
}
