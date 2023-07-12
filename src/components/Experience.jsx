import React, { useState } from 'react'
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import { motion } from "framer-motion-3d";
import { useEffect } from "react";
import { framerMotionConfig } from "./config";
import { useScroll, OrbitControls, Html, Sky, Environment, ContactShadows } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { AllExp } from "./WorkExp";

import { AllSkills } from "./Skills";

export const Experience = (props) => {
  const animations = ["Typing","Falling","Standing"];
  
  const [animation, setAnimation] = useState("Standing");

  const handleAnimationChange = (newAnimation) => {
    setAnimation(newAnimation);
  };
  const { menuOpened } = props;
  const { viewport } = useThree();
  const data = useScroll();

  const cameraPositionX = useMotionValue();
  const cameraLookAtX = useMotionValue();

  const [section, setSection] = useState(0);

  useEffect(() => {
    console.log(section,"section")
    animate(cameraPositionX, menuOpened ? -5 : 0, {
      ...framerMotionConfig,
    });
    animate(cameraLookAtX, menuOpened ? 5 : 0, {
      ...framerMotionConfig,
    });
  }, [menuOpened]);

  useFrame((state) => {
    state.camera.position.x = cameraPositionX.get();
    state.camera.lookAt(cameraLookAtX.get(), 0, 0);
  });


  const [characterAnimation, setCharacterAnimation] = useState("Typing");
  useEffect(() => {
    setCharacterAnimation("Falling_Idle");
    if(section === 0){
      setCharacterAnimation("Wave");
      setTimeout(() => {
        setCharacterAnimation("Standing");
      }, 6000);
    }else if(section === 1 || section === 2){
      setCharacterAnimation("Standing");
      const pointingInterval = setInterval(() => {
        setCharacterAnimation("Pointing");
        setTimeout(() => {
          setCharacterAnimation("Standing");
        }, 3000); // Wait for 1 second to switch back to "Standing" animation
      }, 6000); // Repeat every 10 seconds
  
      // Cleanup the interval when the component unmounts or when the section changes
      return () => clearInterval(pointingInterval);
    }else{
      setTimeout(() => {
        setCharacterAnimation("Standing");
      }, 600);
    }
    
  }, [section]);

  useFrame((state) => {
    let curSection = Math.floor(data.scroll.current * data.pages);

    if (curSection > 3) {
      curSection = 3;
    }

    if (curSection !== section) {
      setSection(curSection);
    }

    state.camera.position.x = cameraPositionX.get();
    state.camera.lookAt(cameraLookAtX.get(), 0, 0);

    // const position = new THREE.Vector3();
    // characterContainerAboutRef.current.getWorldPosition(position);
    // console.log([position.x, position.y, position.z]);

    // const quaternion = new THREE.Quaternion();
    // characterContainerAboutRef.current.getWorldQuaternion(quaternion);
    // const euler = new THREE.Euler();
    // euler.setFromQuaternion(quaternion, "XYZ");

    // console.log([euler.x, euler.y, euler.z]);
  });



  return (
    <>
      {/* <OrbitControls /> */}
      <ambientLight intensity={1}></ambientLight>
      <motion.group 
        // position={section == 0 ? [1.6,-2,0] : [1.6,-10,0]} 
        scale={[3,3,3]}
        animate={"" + section}
        transition={{
          duration: 0.6,
        }}
        variants={{
          0: {
            x:0,
            y:-2,
            z:0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
          },
          1: {
            scale:[2.5,2.5,2.5],
            y: -viewport.height - 2,
            x: -3.2,
            z: 3.2,
            rotateX: 0,
            rotateY: .4,
            rotateZ: -.1,
          },
          2: {
            x: -4,
            y: -viewport.height * 2 - 4,
            z: 0,
            rotateX: 0,
            rotateY: .2,
            rotateZ: 0,
          },
          3: {
            y: -viewport.height * 3 + 1,
            x: 0,
            z: 0,
            rotateX: 0,
            rotateY: -Math.PI / 4,
            rotateZ: 0,
          },
        }}
      >
        <Avatar section={section} animation={characterAnimation} />
      </motion.group>

      <AllExp />
      <AllSkills />
      {/* {section == 1 && (
        <group position={[0,-20,-10]} scale={[.9,.9,.9]} rotation-y={-Math.PI/4}>
          <Desk/>
        </group>
      )} */}
    </>
  );
};
