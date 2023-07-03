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

export const AllSkills = () => {
    const { viewport } = useThree();
    const [currentSkillGroup] = useAtom(currentSkillAtom);
    const cylinderRef = useRef();
  
    useEffect(() => {
      if (cylinderRef.current) {
        const angle = (Math.PI * 2) / skills.length;
        const rotationY = angle * currentSkillGroup;
        cylinderRef.current.rotation.y = rotationY;
      }
    }, [currentSkillGroup]);
  
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
            vec3 colorA = vec3(1.0, 0.0, 0.0); // Start color (red)
            vec3 colorB = vec3(0.0, 0.0, 1.0); // End color (blue)
    
            vec3 gradientColor = mix(colorA, colorB, vUv.x); // Interpolate between the two colors based on the horizontal position
    
            gl_FragColor = vec4(gradientColor, 1.0);
          }
        `,
      };
  
    return (
      <group position-y={-viewport.height * 1 - 2}>
        <mesh ref={cylinderRef} rotation={[-0.2, 0, 0]} position={[0, 1.4, -2]}>
          <cylinderGeometry attach="geometry" args={[3.9, 4, 5.5, 36]} />
          <shaderMaterial
            attach="material"
            args={[gradientShader]}
            side={THREE.DoubleSide}
          />
        </mesh>
        {skills.map((skillGroup, index) => (
          <motion.group key={"skillGroup_" + index}>
            <EachSkill
              currentSkillGroup={currentSkillGroup}
              index={index}
              skillGroup={skillGroup}
            />
          </motion.group>
        ))}
      </group>
    );
  };
  const EachSkill = (props) => {
    const { skillGroup, index, currentSkillGroup } = props;
  
    useEffect(() => {}, [currentSkillGroup]);
  
    // Calculate the angle for each face based on the index
    const angle = (Math.PI * 2) / skills.length;
    const rotationY = angle * (index - currentSkillGroup);
  
    const skillVariants = {
      hidden: { scale: 0.2, transition: { duration: 0.4 } },
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
            initial="hidden"
            animate={index === currentSkillGroup ? "visible" : "hidden"}
            variants={skillVariants}
          >
            <Text position={[0, 0, 0]} fontSize={0.12}>
              {skill.name}
            </Text>
            <mesh position={[0, -0.1, 0.2]}>
              <boxGeometry args={[2, 0.07, 0.07]} />
              <meshBasicMaterial color="gray" />
            </mesh>
            <mesh position={[-1 + skill.level / 100, -0.1, 0.2]}>
              <boxGeometry args={[2 * (skill.level / 100), 0.07, 0.07]} />
              <meshBasicMaterial color="indigo" />
            </mesh>
          </motion.group>
        ))}
      </motion.group>
    );
  };
  
  