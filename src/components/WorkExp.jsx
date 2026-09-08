import { Image, Text, Box, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import * as THREE from 'three';
import { motion } from "framer-motion-3d";
import { atom, useAtom } from "jotai";
import { useEffect, useState, useRef } from "react";

import { workExp } from '../profile';
export { workExp } from '../profile';

export const currentExpAtom = atom(0);

export const AllExp = () => {
  const { viewport } = useThree();
  const [currentExp] = useAtom(currentExpAtom);

  return (
    <group position-y={-viewport.height * 2 - .4}>
      {workExp.map((exp, index) => (
        <motion.group
          key={"exp_" + index}
          position={[index * 2.5, 0, -3]}
          animate={{
            x: 0 + (index - currentExp) * 5,
            y: currentExp === index ? 0 : -1.2,
            z: currentExp === index ? 0 : -2,
            rotateX: currentExp === index ? -.2 : -Math.PI / 3,
            rotateZ: currentExp === index ? 0 : -0.1 * Math.PI,
          }}
        >
          <EachExp exp={exp} highlighted={index === currentExp} />
        </motion.group>
      ))}
    </group>
  );
};
const EachExp = (props) => {
    const { exp, highlighted } = props;
  
    const background = useRef();
    const bgOpacity = useMotionValue(0.4);
  
    const [selectedExperience, setSelectedExperience] = useState(null);
  
    const handleExperienceClick = (experience) => {
      setSelectedExperience(experience);
    };
  
    const handleCloseModal = () => {
      setSelectedExperience(null);
    };
  
    useEffect(() => {
      animate(bgOpacity, highlighted ? 0.7 : 0.4);
    }, [highlighted]);
  
    useFrame(() => {
      background.current.material.opacity = bgOpacity.get();
    });
  
    return (
      <group {...props}>
        <mesh
          position-z={-0.001}
          onClick={() => handleExperienceClick(exp)}
          ref={background}
        >
          <planeGeometry args={[4.5, 5.5, 4]} />
          <meshBasicMaterial color="#3366ff" transparent opacity={0.8} side={THREE.DoubleSide}>
        </meshBasicMaterial>
        </mesh>
        <Image
          scale={[4.4, 3, 2]}
          url={exp.image || "/images/myavatar.png"}
          toneMapped={false}
          position-y={1}
        />
        <Text
          maxWidth={3.5}
          anchorX={"left"}
          anchorY={"top"}
          fontSize={0.3}
          position={[-1.8, -0.8, 0]}
        >
          {exp.company.toUpperCase()}
        </Text>
        <Text
          maxWidth={2}
          anchorX="left"
          anchorY="top"
          fontSize={0.2}
          position={[-1.8, -1.4, 0]}
        >
          {exp.period}
        </Text>
        <Text
          maxWidth={2}
          anchorX="left"
          anchorY="top"
          fontSize={0.2}
          position={[-1.8, -1.6, 0]}
        >
          {exp.role.toUpperCase()}
        </Text>
        {selectedExperience && (
          <Modal onClose={handleCloseModal} selectedExperience={selectedExperience} />
        )}
      </group>
    );
  };

  const Modal = ({ onClose, selectedExperience }) => {
    return (
      <group>
        <group position={[0, 1.4, 0.1]}>
          <Box args={[6, 6, 0.2]} position={[0, 0, 0]}>
            <meshBasicMaterial color="green" />
          </Box>
          <group>
            <group scale={[1, 1, 1]}>
              <Text
                fontSize={0.15}
                color="white"
                style={{ marginLeft: 'auto', cursor: 'pointer' }}
                onClick={onClose}
                position={[2.6, 2.4, 0.4]}
              >
                Close
              </Text>
              <Text position={[0, 2.2, 0.4]} fontSize={0.2} fontWeight="bold" lineHeight={1} marginBottom={0.3}>
                {selectedExperience.role}
              </Text>
              <Text position={[0, 2, 0.4]} fontSize={0.15} color="white" marginBottom={0.3}>
                {selectedExperience.period}
              </Text>
              <Text position={[-1.5, 1.8, 0.4]} fontSize={0.1} whiteSpace="wrap" marginBottom={0.3}>
                Summary: {selectedExperience.description}
              </Text>
              {selectedExperience.responsibilities.map((responsibility, resIndex) => (
                <Text
                  key={resIndex}
                  position={[-2.6, 1.6 - resIndex * 0.3, 0.4]}
                  fontSize={0.1}
                  maxWidth={5.5} 
                  textAlign="left" 
                  anchorX="left"
                  textAnchor="start"
                >
                  {responsibility}
                </Text>
              ))}
            </group>
          </group>
        </group>
      </group>
    );
  };
  