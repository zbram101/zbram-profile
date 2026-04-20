import { useFrame, useThree } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { skillGroups } from "../data/profile";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import { useViewport } from "../hooks/useViewport";
import { getSceneLayoutPreset } from "../ui/layoutPresets";
import { getMotionPreset } from "../ui/motionPresets";

export const skills = skillGroups;
export const currentSkillAtom = atom(0);

const faceDepth = 2.46;

const SkillFace = ({ skillGroup, index }) => {
  const angle = (Math.PI * 2) / skills.length;
  const rotationY = angle * index;

  return (
    <group rotation={[0, rotationY, 0]}>
      <group position={[0, 1.82, faceDepth]}>
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[2.55, 3.18]} />
          <meshBasicMaterial color="#102127" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
        {skillGroup.skills.map((skill, skillIndex) => {
          const width = 0.88 + skill.level / 125;
          const x = -0.52 + skill.level / 210;
          const y = 1.08 - skillIndex * 0.38;
          const shade = skillIndex % 2 === 0 ? "#dfa07a" : "#0d5c63";

          return (
            <group key={`${skillGroup.title}-${skill.name}`} position={[0, y, 0]}>
              <mesh position={[0, 0, -0.04]}>
                <boxGeometry args={[2.04, 0.08, 0.08]} />
                <meshBasicMaterial color="#314547" transparent opacity={0.54} />
              </mesh>
              <mesh position={[x, 0, 0]}>
                <boxGeometry args={[width, 0.12, 0.12]} />
                <meshBasicMaterial color={shade} transparent opacity={0.95} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

export const AllSkills = () => {
  const { viewport } = useThree();
  const [currentSkillGroup, setCurrentSkillGroup] = useAtom(currentSkillAtom);
  const groupRef = useRef();
  const orbitRef = useRef();
  const accentRef = useRef();
  const { tier, width } = useViewport();
  const reducedMotion = useReducedMotionPreference();
  const motionPreset = getMotionPreset({
    intensity: "medium",
    reducedMotion,
  });
  const scenePreset = getSceneLayoutPreset("skills", width);

  useEffect(() => {
    if (reducedMotion) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentSkillGroup((value) => (value + 1) % skills.length);
    }, 5200);

    return () => window.clearInterval(intervalId);
  }, [reducedMotion, setCurrentSkillGroup]);

  useFrame((_, delta) => {
    if (!groupRef.current || !scenePreset?.visible) {
      return;
    }

    const segment = (Math.PI * 2) / skills.length;
    const targetRotation = -currentSkillGroup * segment;
    const smoothing = motionPreset.scene.smoothing;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      1 - Math.exp(-delta * smoothing)
    );

    if (!reducedMotion && orbitRef.current) {
      orbitRef.current.rotation.z += delta * motionPreset.scene.orbitSpeed;
    }

    if (!reducedMotion && accentRef.current) {
      accentRef.current.rotation.x -= delta * (motionPreset.scene.orbitSpeed * 0.7);
      accentRef.current.rotation.y += delta * (motionPreset.scene.orbitSpeed * 0.45);
    }
  });

  const gradientShader = {
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;

      void main() {
        vec3 colorA = vec3(0.10, 0.40, 0.43);
        vec3 colorB = vec3(0.77, 0.43, 0.26);
        vec3 gradientColor = mix(colorA, colorB, vUv.y);
        gl_FragColor = vec4(gradientColor, 0.82);
      }
    `,
  };

  if (!scenePreset?.visible) {
    return null;
  }

  const verticalOffset =
    tier === "mobile" ? -1.02 : tier === "tablet" ? -1.18 : -1.34;
  const indicatorCount = tier === "mobile" ? 6 : 10;

  return (
    <group
      scale={scenePreset.scale}
      position={[scenePreset.x, -viewport.height * 1 + verticalOffset, scenePreset.z]}
      ref={groupRef}
    >
      <group position={[0, 1.8, 0]}>
        <group ref={orbitRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.95, 0.05, 18, 180]} />
            <meshBasicMaterial color="#f3c7a8" transparent opacity={0.48} />
          </mesh>
          <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
            <torusGeometry args={[2.42, 0.04, 18, 180]} />
            <meshBasicMaterial color="#0d5c63" transparent opacity={0.22} />
          </mesh>
        </group>
        <group ref={accentRef}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.4, 0.04, 12, 120]} />
            <meshBasicMaterial color="#dfa07a" transparent opacity={0.32} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.32, 24, 24]} />
            <shaderMaterial args={[gradientShader]} transparent />
          </mesh>
        </group>
      </group>
      <mesh position={[0, -0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 3.1, 48]} />
        <meshBasicMaterial color="#0d5c63" transparent opacity={0.09} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: indicatorCount }).map((_, index) => {
        const angle = (Math.PI * 2 * index) / indicatorCount;

        return (
          <mesh key={angle} position={[Math.cos(angle) * 3.02, 1.8 + Math.sin(angle) * 3.02, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? "#dfa07a" : "#0d5c63"}
              transparent
              opacity={0.65}
            />
          </mesh>
        );
      })}
      {skills.map((skillGroup, index) => (
        <SkillFace key={`skill_group_${skillGroup.title}`} index={index} skillGroup={skillGroup} />
      ))}
    </group>
  );
};
