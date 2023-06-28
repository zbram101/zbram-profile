import { motion } from "framer-motion";
import React, { useState } from 'react';
import {  useAtom } from "jotai";
import { currentExpAtom, workExp } from "./WorkExp";
import './interface.css'
export const Section = (props) => {
  const { children } = props;

  return (
    <motion.section
      className={`
  h-screen w-screen p-8 max-w-screen-2xl mx-auto
  flex flex-col items-start justify-center overflow-x-auto
  `}
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 1,
          delay: 0.6,
        },
      }}
    >
      {children}
    </motion.section>
  );
};

export const Interface = () => {
  return (
    <div className="flex flex-col items-center w-screen">
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
};

const AboutSection = () => {
  return (
    <Section>
      <h1 className="text-6xl font-extrabold leading-snug">
        Hi, I'm
        <br />
        <span className="px-1 italic">Bharadwaj</span>
      </h1>
      <motion.p
        className="text-lg text-gray-600 mt-4"
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 1.5,
        }}
      >
        I enjoy building software solutions
        <br />
        and helping others achieve their goals
      </motion.p>
      <motion.button
        className={`bg-indigo-600 text-white py-4 px-8 
      rounded-lg font-bold text-lg mt-16`}
        initial={{
          opacity: 0,
          y: 25,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          delay: 2,
        }}
      >
        Contact me
      </motion.button>
    </Section>
  );
};

const skills = [
    {
      title: "Languages",
      skills: [
        { name: "Javascript", level: 50 },
        { name: "Typescript", level: 50 },
        { name: "Python", level: 50 },
        { name: "SQL", level: 50 },
        { name: "TSQL", level: 50 }
      ]
    },
    {
      title: "Database",
      skills: [
        { name: "Microsoft Sql Server", level: 50 },
        { name: "Oracle 9g", level: 50 },
        { name: "MySql", level: 50 },
        { name: "Redis (NO-SQL)", level: 50 },
        { name: "Postgres", level: 50 },
        { name: "Snowflake", level: 50 }
      ]
    },
    {
      title: "Frontend",
      skills: [
        { name: "Angular", level: 50 },
        { name: "React", level: 50 },
        { name: "RxJS", level: 50 },
        { name: "AEM", level: 50 }
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Flask", level: 50 },
        { name: "ExpressJS", level: 50 },
        { name: "SqlAlchemy", level: 50 },
        { name: "Kafka", level: 50 }
      ]
    },
    {
      title: "Infrastructure",
      skills: [
        { name: "AWS", level: 50 },
        { name: "EC2", level: 50 },
        { name: "RDS", level: 50 },
        { name: "Elastic Beanstalk", level: 50 },
        { name: "S3", level: 50 },
        { name: "SES", level: 50 },
        { name: "Route 53", level: 50 },
        { name: "SQS", level: 50 },
        { name: "Kafka", level: 50 }
      ]
    },
    {
      title: "Applications",
      skills: [
        { name: "Salesforce (SFDC)", level: 50 },
        { name: "SSIS", level: 50 },
        { name: "Adobe Experience Manager (AEM)", level: 50 },
        { name: "Walkme", level: 50 },
        { name: "Zapier", level: 50 },
        { name: "JIRA", level: 50 },
        { name: "Confluence", level: 50 },
        { name: "Netsuite", level: 50 },
        { name: "Tableau", level: 50 },
        { name: "Mulesoft", level: 50 },
        { name: "Active Directory (AD)", level: 50 },
        { name: "OKTA", level: 50 }
      ]
    },
    {
      title: "Testing",
      skills: [
        { name: "Selenium", level: 50 },
        { name: "Perfecto", level: 50 },
        { name: "JAWS (ADA testing)", level: 50 }
      ]
    }
  ];

const SkillsSection = () => {
    return (
        <Section>
          <motion.div whileInView={"visible"}>
            <h2 className="text-5xl font-bold">Skills</h2>
            <br></br>
            <div className="overflow-x-auto">
              <div className="flex space-x-8">
                {skills.map((skillGroup, index) => (
                  <div key={index} className="w-64">
                    <h4 className="text-xl font-bold">{skillGroup.title}</h4>
                    <div className="mt-8 space-y-4">
                      {skillGroup.skills.map((skill, skillIndex) => (
                        <div className="w-64" key={skillIndex}>
                          <motion.h3
                            className="text-xl font-bold text-gray-800"
                            initial={{
                              opacity: 0,
                            }}
                            variants={{
                              visible: {
                                opacity: 1,
                                transition: {
                                  duration: 1,
                                  delay: 1 + skillIndex * 0.2,
                                },
                              },
                            }}
                          >
                            {skill.name}
                          </motion.h3>
                          <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                            <motion.div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${skill.level}%` }}
                              initial={{
                                scaleX: 0,
                                originX: 0,
                              }}
                              variants={{
                                visible: {
                                  scaleX: 1,
                                  transition: {
                                    duration: 1,
                                    delay: 1 + skillIndex * 0.2,
                                  },
                                },
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </Section>
      );
                              
};

const ContactSection = () => {
  return (
    <Section>
      <h2 className="text-5xl font-bold">Contact me</h2>
      <div className="mt-8 p-8 rounded-md bg-white w-96 max-w-full">
        <form>
          <label for="name" className="font-medium text-gray-900 block mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
          />
          <label
            for="email"
            className="font-medium text-gray-900 block mb-1 mt-8"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
          />
          <label
            for="email"
            className="font-medium text-gray-900 block mb-1 mt-8"
          >
            Message
          </label>
          <textarea
            name="message"
            id="message"
            className="h-32 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
          />
          <button className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-16 ">
            Submit
          </button>
        </form>
      </div>
    </Section>
  );
};



const ExperienceSection = () => {
    const [currentProject, setCurrentProject] = useAtom(currentExpAtom);
  
    const nextProject = () => {
      setCurrentProject((currentProject + 1) % workExp.length);
    };
  
    const previousProject = () => {
      setCurrentProject((currentProject - 1 + workExp.length) % workExp.length);
    };
  
    return (
      <Section>
        <div className="flex w-full h-full gap-8 items-baseline justify-center inset-x-0 bottom-0">
          <button
            className="hover:text-indigo-600 transition-colors"
            onClick={previousProject}
          >
            ← Previous
          </button>
          <h2 className="text-5xl font-bold">Experience</h2>
          <button
            className="hover:text-indigo-600 transition-colors"
            onClick={nextProject}
          >
            Next →
          </button>
        </div>
      </Section>
    );
  };
  
  const ProjectsSection = () => {
    // const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);
  
    const nextProject = () => {
    //   setCurrentProject((currentProject + 1) % projects.length);
    };
  
    const previousProject = () => {
    //   setCurrentProject((currentProject - 1 + projects.length) % projects.length);
    };
  
    return (
      <Section>
        <div className="flex w-full h-full gap-8 items-center justify-center">
          <button
            className="hover:text-indigo-600 transition-colors"
            onClick={previousProject}
          >
            ← Previous
          </button>
          <h2 className="text-5xl font-bold">Projects</h2>
          <button
            className="hover:text-indigo-600 transition-colors"
            onClick={nextProject}
          >
            Next →
          </button>
        </div>
      </Section>
    );
  };
  


//   const ExperienceSection = () => {
    
//     const [selectedExperience, setSelectedExperience] = useState(null);

//     const handleExperienceClick = (experience) => {
//       setSelectedExperience(experience);
//     };
  
//     const handleCloseModal = () => {
//       setSelectedExperience(null);
//     };
  
//     return (
//       <Section>
//         <motion.div animate="visible" transition={.8} whileInView={"visible"}>
//           <h2 className="text-5xl font-bold">Experience</h2>
//           <br />
//           <div className="overflow-x-auto">
//             <div className="flex space-x-8">
//               {experience.map((exp, index) => (
//                 <div key={index} className="w-96">
//                   <div
//                     className="cursor-pointer"
//                     onClick={() => handleExperienceClick(exp)}
//                   >
//                     <img
//                       src={exp.image}
//                       alt={exp.title}
//                       className="object-cover w-full h-64"
//                     />
//                   </div>
//                   <h4 className="text-xl font-bold">{exp.title}</h4>
//                   <h5 className="text-lg font-semibold">{exp.role}</h5>
//                   <p className="text-gray-500 text-sm">{exp.period}</p>
//                   <p className="text-sm mt-2">{exp.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </motion.div>
//         {selectedExperience && (
//           <Modal onClose={handleCloseModal}>
//             <h2 className="text-2xl font-bold">{selectedExperience.title}</h2>
//             <h3 className="text-lg font-semibold">{selectedExperience.role}</h3>
//             <p className="text-gray-500">{selectedExperience.period}</p>
//             <p className="text-sm mt-2">{selectedExperience.description}</p>
//             <ul className="mt-4 list-disc list-inside">
//               {selectedExperience.responsibilities.map((responsibility, resIndex) => (
//                 <li key={resIndex}>{responsibility}</li>
//               ))}
//             </ul>
//           </Modal>
//         )}
//       </Section>
//     );
//   };


  const Modal = ({ children, onClose }) => {
    const modalVariants = {
      hidden: {
        opacity: 0,
        scale: 0.8,
      },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.6,
        },
      },
    };
  
    const overlayVariants = {
      hidden: {
        opacity: 0,
      },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.6,
        },
      },
    };
  
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        initial="hidden"
        animate="visible"
        variants={overlayVariants}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg p-8"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Experience Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };
  