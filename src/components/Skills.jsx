import { Image, Text, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import * as THREE from 'three';
import { motion } from "framer-motion-3d";
import { atom, useAtom } from "jotai";
import { useEffect, useState, useRef } from "react";

export const skills = [
    {
      title: "Languages",
      skills: [
        { name: "Javascript", level: 80 },
        { name: "Typescript", level: 70 },
        { name: "Python", level: 60 },
        { name: "SQL", level: 80 },
        { name: "TSQL", level: 80 }
      ]
    },
    {
      title: "Database",
      skills: [
        { name: "Microsoft Sql Server", level: 80 },
        { name: "Oracle 9g", level: 60 },
        { name: "MySql", level: 90 },
        { name: "Redis (NO-SQL)", level: 50 },
        { name: "Postgres", level: 80 },
        { name: "Snowflake", level: 50 }
      ]
    },
    {
      title: "Frontend",
      skills: [
        { name: "Angular", level: 60 },
        { name: "React", level: 80 },
        { name: "RxJS", level: 80 },
        { name: "AEM", level: 40 }
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Flask", level: 60 },
        { name: "ExpressJS", level: 60 },
        { name: "SqlAlchemy", level: 50 },
        { name: "Kafka", level: 40 }
      ]
    },
    {
      title: "Infrastructure",
      skills: [
        { name: "AWS", level: 50 },
        { name: "EC2", level: 60 },
        { name: "RDS", level: 70 },
        { name: "Elastic Beanstalk", level: 60 },
        { name: "S3", level: 90 },
        { name: "SES", level: 80 },
        { name: "Route 53", level: 80 },
        { name: "SQS", level: 50 },
      ]
    },
    {
      title: "SASS/ERP/Tools",
      skills: [
        { name: "Salesforce (SFDC)", level: 50 },
        { name: "SSIS", level: 80 },
        { name: "Walkme", level: 90 },
        { name: "Zapier", level: 90 },
        { name: "JIRA", level: 80 },
        { name: "Confluence", level: 70 },
        { name: "Tableau", level: 60 },
        { name: "Mulesoft", level: 50 },
        { name: "Active Directory (AD)", level: 50 },
        { name: "OKTA", level: 50 }
      ]
    },
    {
      title: "Testing",
      skills: [
        { name: "Selenium", level: 60 },
        { name: "Perfecto", level: 60 },
        { name: "JAWS (ADA testing)", level: 50 }
      ]
    }
  ];

export const currentSkillAtom = atom(0);


const EachSkill = (props) => {
  const { skillGroup, index, currentSkillGroup } = props;

  useEffect(() => {}, [currentSkillGroup]);

  // Calculate the angle for each face based on the index
  const angle = (Math.PI * 2) / skills.length;
  const rotationY = angle * (index - currentSkillGroup)+.4;

  const skillVariants = {
    visible: { scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <motion.group {...props} scale={0.8} rotation={[0, rotationY, 0]}>
      <Text maxWidth={3.5} fontSize={0.16} position={[0, 5.4, 3.8]}>
        {skillGroup.title.toUpperCase()}
      </Text>

      {skillGroup.skills.map((skill, skillIndex) => (
        <motion.group
          key={"skill_" + skillIndex}
          position={[0, 5.2 - skillIndex * 0.4, 3.8]}
          initial="visible"
          variants={skillVariants}
        >
          <Text fontSize={0.12}>
            {skill.name}
          </Text>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[2, 0.07, 0.07]} />
            <meshBasicMaterial color="gray" />
          </mesh>
          <mesh position={[-1 + skill.level / 100, -0.1, 0]}>
            <boxGeometry args={[2 * (skill.level / 100), 0.08, 0.08]} />
            <meshBasicMaterial color="indigo" />
          </mesh>
        </motion.group>
      ))}
    </motion.group>
  );
};

export const AllSkills = () => {
  const { viewport } = useThree();
  const [currentSkillGroup, setCurrentSkillGroup] = useAtom(currentSkillAtom);
  const [isSpinning, setIsSpinning] = useState(true);
  const groupRef = useRef();


  const handleCylinderClick = () => {
    setIsSpinning(!isSpinning);
  };

  const gradientShader = {
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
  
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
  
      void main() {
        vec3 colorA = vec3(0.4, 0.2, 0.8); // Start color (purple)
        vec3 colorB = vec3(0.0, 0.6, 1.0); // End color (blue)
  
        vec3 gradientColor = mix(colorA, colorB, vUv.y); // Interpolate between the two colors based on the vertical position
  
        gl_FragColor = vec4(gradientColor, 1.0);
      }
    `,
  };
  
  useFrame(() => {
    if (groupRef.current && isSpinning) {
      groupRef.current.rotation.y += 0.002; // Adjust the rotation speed as desired
    }
  });

  return (
    <group scale={0.95} position-y={-viewport.height * 1 - 1.6} ref={groupRef}>
      <mesh
        // rotation={[-0.2, 0, 0]}
        // position={[0, 1.4, -2]}
        position={[0, 1.8, 0]}
        onClick={handleCylinderClick}
      >
        <cylinderGeometry attach="geometry" args={[3.3, 3.3, 5.5, skills.length]} />
        <shaderMaterial
          attach="material"
          args={[gradientShader]}
          side={THREE.DoubleSide}
        />
      </mesh>
      {skills.map((skillGroup, index) => {
        const diff = Math.abs(index - currentSkillGroup);

          const angle = (Math.PI * 2) / skills.length;
          const rotationY = angle * index;
          return (
            <motion.group
              key={"skillGroup_" + index}
              rotation={[0, rotationY, 0]}
              // position={[positionX, 0, positionZ]}
            >
              <EachSkill
                currentSkillGroup={currentSkillGroup}
                index={index}
                skillGroup={skillGroup}
              />
            </motion.group>
          );
      })}
    </group>
  );
};