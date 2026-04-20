import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Avatar } from "./Avatar";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import { interpolateViewport, useViewport } from "../hooks/useViewport";
import { getMotionPreset } from "../ui/motionPresets";

const BASE_POSTURE = { standingPoseTime: 1.02, pointingPoseTime: 0.82, idleYawOffset: 0 };
const LOOK_LEAD_MS = 850;
const POINT_WINDOW_MS = 1200;
const CUE_INTERVAL_MS = 6200;
const SCROLL_SETTLE_MS = 900;

function getCharacterPlacement(width) {
  return {
    x: interpolateViewport(width, -1.9, -3.58),
    y: interpolateViewport(width, -1.88, -2.28),
    z: interpolateViewport(width, 1.04, 0.72),
    scale: interpolateViewport(width, 1.04, 1.78),
    idleYaw: interpolateViewport(width, 0.38, 0.2),
    lookYaw: interpolateViewport(width, 0.98, 0.72),
  };
}

export const SceneCharacter = ({ section = 0 }) => {
  const { width } = useViewport();
  const reducedMotion = useReducedMotionPreference();
  const motionPreset = getMotionPreset({
    intensity: "medium",
    reducedMotion,
  });
  const groupRef = useRef(null);
  const timersRef = useRef({
    lookDelay: null,
    pointDelay: null,
    resetDelay: null,
    interval: null,
  });
  const settleUntilRef = useRef(0);
  const placement = getCharacterPlacement(width);
  const [gesturePhase, setGesturePhase] = useState("idle");
  const isCueActive = gesturePhase === "look" || gesturePhase === "point";

  useEffect(() => {
    settleUntilRef.current = performance.now() + SCROLL_SETTLE_MS;
    setGesturePhase("idle");
  }, [section]);

  useEffect(() => {
    const timers = timersRef.current;

    function clearCueTimers() {
      if (timers.lookDelay) {
        window.clearTimeout(timers.lookDelay);
        timers.lookDelay = null;
      }
      if (timers.pointDelay) {
        window.clearTimeout(timers.pointDelay);
        timers.pointDelay = null;
      }
      if (timers.resetDelay) {
        window.clearTimeout(timers.resetDelay);
        timers.resetDelay = null;
      }
    }

    function runCueCycle() {
      if (performance.now() < settleUntilRef.current) {
        return;
      }

      clearCueTimers();
      setGesturePhase("look");
      timers.pointDelay = window.setTimeout(() => {
        setGesturePhase("point");
      }, LOOK_LEAD_MS);
      timers.resetDelay = window.setTimeout(() => {
        setGesturePhase("idle");
      }, LOOK_LEAD_MS + POINT_WINDOW_MS);
    }

    timers.lookDelay = window.setTimeout(runCueCycle, 1400);
    timers.interval = window.setInterval(runCueCycle, CUE_INTERVAL_MS);

    return () => {
      clearCueTimers();
      if (timers.interval) {
        window.clearInterval(timers.interval);
        timers.interval = null;
      }
    };
  }, []);

  const animation = gesturePhase === "point" ? "Pointing" : "Standing";
  const poseOnly = true;
  const poseTime =
    gesturePhase === "point"
      ? BASE_POSTURE.pointingPoseTime
      : gesturePhase === "look"
        ? 1.36
        : BASE_POSTURE.standingPoseTime;

  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const smoothing = reducedMotion
      ? motionPreset.scene.smoothing * 1.25
      : motionPreset.scene.smoothing;
    const targetY = placement.y;
    const targetYaw = isCueActive
      ? placement.lookYaw
      : placement.idleYaw + BASE_POSTURE.idleYawOffset;

    const x = THREE.MathUtils.damp(group.position.x, placement.x, smoothing, delta);
    const y = THREE.MathUtils.damp(group.position.y, targetY, smoothing, delta);
    const z = THREE.MathUtils.damp(group.position.z, placement.z, smoothing, delta);
    const scale = THREE.MathUtils.damp(group.scale.x, placement.scale, smoothing, delta);
    const rotationY = THREE.MathUtils.damp(group.rotation.y, targetYaw, smoothing, delta);

    group.position.set(x, y, z);
    group.scale.setScalar(scale);
    group.rotation.y = rotationY;
  });

  return (
    <group ref={groupRef} rotation={[0, placement.idleYaw, 0]} renderOrder={8}>
      <Avatar animation={animation} poseOnly={poseOnly} poseTime={poseTime} />
    </group>
  );
};
