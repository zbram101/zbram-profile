import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import { motion } from "framer-motion-3d";
import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { workExperience } from "../data/profile";
import { interpolateViewport, useViewport } from "../hooks/useViewport";

export const workExp = workExperience;
export const currentExpAtom = atom(0);

export const AllExp = () => {
  const { viewport } = useThree();
  const [currentExp, setCurrentExp] = useAtom(currentExpAtom);
  const { width } = useViewport();
  const positionX = interpolateViewport(width, 3.3, 6.2);
  const positionZ = interpolateViewport(width, -0.72, -0.52);
  const scale = interpolateViewport(width, 0.58, 0.9);

  return (
    <group
      position={[positionX, -viewport.height * 2 - 0.5, positionZ]}
      scale={scale}
    >
      {workExp.map((experience, index) => (
        <motion.group
          key={`experience_${index}`}
          position={[index * 2.6, 0, -3]}
          animate={{
            x: (index - currentExp) * 4.35,
            y: currentExp === index ? 0 : -0.95,
            z: currentExp === index ? 0 : -1.8,
            rotateX: currentExp === index ? -0.12 : -Math.PI / 3.9,
            rotateZ: currentExp === index ? 0 : -0.08 * Math.PI,
          }}
        >
          <ExperienceCard
            experience={experience}
            highlighted={index === currentExp}
            onSelect={() => setCurrentExp(index)}
          />
        </motion.group>
      ))}
    </group>
  );
};

const ExperienceCard = ({ experience, highlighted, onSelect, ...props }) => {
  const background = useRef();
  const accentBar = useRef();
  const cardOpacity = useMotionValue(0.45);
  const accentOpacity = useMotionValue(0.55);

  useEffect(() => {
    animate(cardOpacity, highlighted ? 0.9 : 0.45);
    animate(accentOpacity, highlighted ? 1 : 0.55);
  }, [accentOpacity, cardOpacity, highlighted]);

  useFrame(() => {
    if (background.current) {
      background.current.material.opacity = cardOpacity.get();
    }

    if (accentBar.current) {
      accentBar.current.material.opacity = accentOpacity.get();
    }
  });

  return (
    <group {...props}>
      <mesh position-z={-0.02} ref={background} onClick={onSelect}>
        <planeGeometry args={[3.45, 4.1, 4, 4]} />
        <meshBasicMaterial color="#102127" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-1.62, 1.24, 0.01]} ref={accentBar}>
        <planeGeometry args={[0.15, 1.88]} />
        <meshBasicMaterial color={experience.accent} transparent opacity={0.92} />
      </mesh>
      {[0, 1, 2, 3].map((barIndex) => (
        <mesh
          key={barIndex}
          position={[-0.28 + barIndex * 0.06, 0.78 - barIndex * 0.42, 0.02]}
        >
          <boxGeometry args={[1.95 - barIndex * 0.22, 0.14, 0.09]} />
          <meshBasicMaterial
            color={barIndex < 2 ? experience.accent : "#7d9796"}
            transparent
            opacity={barIndex < 2 ? 0.9 : 0.38}
          />
        </mesh>
      ))}
      <mesh position={[0.58, -1.34, 0.01]}>
        <circleGeometry args={[0.13, 20]} />
        <meshBasicMaterial
          color={highlighted ? "#dfa07a" : "#f4efe7"}
          transparent
          opacity={highlighted ? 1 : 0.5}
        />
      </mesh>
    </group>
  );
};
