import { Image, Text, Box, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";

import { motion } from "framer-motion-3d";
import { atom, useAtom } from "jotai";
import { useEffect, useState, useRef } from "react";

export const workExp = [
  {
    company: "Globality",
    role: "Lead Application Engineer",
    description:"Lead 2 teams Integrations and Business Applictions",
    image:"images/Glo.jpeg",
    period: "May 2021 – May 2023",
    responsibilities: [
      "Led development of critical applications, including engineering design, product development, and implementation",
      "Built a rules-based evaluation application for bid proposals ensuring adaptability to changing requirements",
      "Built a system to map and report Net Promoter Score from multiple sources and provide valuable insights to drive business growth",
      "Developed and Implemented Technical Design Review Process across all engineering teams based on sound engineering principles of full SDLC life cycle covering platform changes and 3rd party application changes",
      "Partnered with Product and Engineering to create team roadmap and prioritize build of internal tools and built reports to review and recourse to better team performance",
      "Contributed innovative ideas and solutions to software architecture and design decisions, ensuring scalability and maintainability",
      "Implemented agile development process and educated business members and stakeholders on benefits of agile process",
      "Created Integrations with Slack, Walkme, Netsuite, SFDC, AD, Freshservice, Cronitor for operational and data needs"
    ]
  },
  {
    company: "Kaiser Permanente",
    role: "Software Application Engineer",
    description:"Part of a scrum team building features in kp.org",
    image:"images/Kaiser.png",
    period: "Oct 2018 – Sep 2021",
    responsibilities: [
      "Designed and developed responsive and user-friendly web applications using modern front-end frameworks (Handlebars, Angular, React)",
      "Implemented web designs and visualizations using HTML, CSS, and JavaScript, ensuring cross-browser, device compatibility, and accessibility (ADA)",
      "Collaborated cross-functionally with product managers and UI/UX designers to plan and develop intuitive user interfaces and ensure successful delivery of projects",
      "Led code reviews and design reviews for critical projects",
      "Developed technical documentation for web applications, including user manuals and technical specifications",
      "Created and administered training and internal certification program for SSIS integration tool across the department",
      "Conducted technical interviews for hiring engineers, QA, and BA and onboarded new hires",
      "Mentored junior-level developers on SDLC process and guided them to enhance their technical skills"
    ]
  },
  {
    company: "Kaiser Permanente (Contract)",
    role: "Software Engineer",
    description:"Part of a scrum team to build and test features in kp.org",
    image:"images/Kaiser.png",
    period: "Oct 2015 – Sep 2018",
    responsibilities: [
      "Translated wireframes into functional requirements and built reusable and high-performance code for UI components",
      "Migrated web applications from using RESTful back-end APIs to GraphQL services",
      "Built and authored AEM components and pages to support CMS needs and modified out-of-the-box AEM components to meet project requirements",
      "Supported dual languages using AEM sites and JCR, set up analytics using AEM Analytics tool",
      "Championed new operational principles to increase automated test cases for scalable and more robust solutions",
      "Ensured 94% of test cases were automated and built custom scripts to auto-update test status for monitoring health, issues, and gaps",
      "Built KP testing framework including features to standardize testing practice across KP org",
      "Built a mailer service for a microservice architecture backend and upgraded multiple services to leverage the new mailer system"
    ]
  },
  {
    company: "Anthem (Contract)",
    role: "Data Engineer",
    description:"Create, maintaine Data",
    image:"images/Anthem.jpeg",
    period: "July 2013 – Sep 2015",
    responsibilities: [
      "Built scalable data pipelines involving data ingestion and transformation and prototyped emerging solutions using custom scripts",
      "Trained the offshore team and implemented a ticketing system for efficient data change request submission and triaging",
      "Wrote production-ready recursive scripts to solve and mitigate data discrepancies in production",
      "Created automation scripts for generating test data for testers",
      "Wrote SSIS packages for moving data examples being moving data from warehouse to data marts for analytics teams",
      "Built views based on the latest data so analytics teams can use reports to interpret data",
      "Wrote SSIS packages that process flat files dropped by vendors into an FTP location",
      "Created functions and procedures for processing and managing platform interactions",
      "Created OLAP DBs for researchers and analysts to leverage a subset of the data in DW"
    ]
  }
];

export const currentExpAtom = atom(0);

export const AllExp = () => {
  const { viewport } = useThree();
  const [currentExp] = useAtom(currentExpAtom);

  return (
    <group position-y={-viewport.height * 2 - 1.4}>
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
          <meshBasicMaterial color="black" transparent opacity={0.4} />
        </mesh>
        <Image
          scale={[4.4, 3, 2]}
          url={exp.image}
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
                position={[2, 2.4, 0.4]}
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
  