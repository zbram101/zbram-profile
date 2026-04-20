import { useFrame, useThree } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import { useRef } from "react";
import * as THREE from "three";
import { selectedInitiatives } from "../data/profile";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import { useViewport } from "../hooks/useViewport";
import { getSceneLayoutPreset } from "../ui/layoutPresets";
import { getMotionPreset } from "../ui/motionPresets";

export const currentProjectAtom = atom(0);

export const Projects = () => {
  const { viewport } = useThree();
  const [currentProject] = useAtom(currentProjectAtom);
  const groupRef = useRef();
  const { width } = useViewport();
  const reducedMotion = useReducedMotionPreference();
  const motionPreset = getMotionPreset({
    intensity: "medium",
    reducedMotion,
  });
  const scenePreset = getSceneLayoutPreset("projects", width);

  if (!scenePreset?.visible) {
    return null;
  }

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    if (reducedMotion) {
      return;
    }

    groupRef.current.rotation.y += delta * (motionPreset.scene.autoRotateSpeed * 0.5);
  });

  return (
    <group
      position={[scenePreset.x, -viewport.height * 3 - 1.7, scenePreset.z]}
      scale={scenePreset.scale}
      ref={groupRef}
    >
      <mesh position={[0, 1.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 3.9, 48]} />
        <meshBasicMaterial color="#0d5c63" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {selectedInitiatives.map((initiative, index) => {
        const angle = (Math.PI * 2 * index) / selectedInitiatives.length;
        const isActive = currentProject === index;
        const radius = isActive ? 2.45 : 2.75;
        const y = isActive ? 2.05 : 1.82;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={initiative.title} position={[x, y, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <mesh>
              <boxGeometry args={[1.28, 0.86, 0.22]} />
              <meshStandardMaterial
                color={isActive ? "#dfa07a" : "#17313a"}
                transparent
                opacity={isActive ? 0.96 : 0.82}
              />
            </mesh>
            <mesh position={[0, 0, 0.14]}>
              <planeGeometry args={[0.96, 0.1]} />
              <meshBasicMaterial
                color={isActive ? "#102127" : "#dfa07a"}
                transparent
                opacity={0.92}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
