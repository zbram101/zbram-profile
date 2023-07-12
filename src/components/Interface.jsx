import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from 'react';
import {  useAtom } from "jotai";
import { currentExpAtom, workExp } from "./WorkExp";
import { Chat } from "./Chat";

import { currentSkillAtom, skills } from "./Skills";

export const Section = (props) => {
  const { children } = props;

  return (
    <motion.section
      className={`
  h-screen w-screen p-8 max-w-screen-2xl mx-auto
  flex flex-col justify-center overflow-x-auto
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
      <Chat />
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
      I enjoy building software solutions.
      <br />
      I like teaching/learning from others 
    </motion.p>
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <motion.button
        className={`bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-16`}
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
    </div>
  </Section>
  
  );
};


const SkillsSection = () => {

  const [currentSkillGroup, setCurrentSkillGroup] = useAtom(currentSkillAtom);
  
  const nextSkillGroup = () => {
    setCurrentSkillGroup((currentSkillGroup + 1) % skills.length);
    console.log(currentSkillGroup)
  };

  const previousSkillGroup = () => {
    setCurrentSkillGroup((currentSkillGroup - 1 + skills.length) % skills.length);
  };

  return (
    <Section>
      <div className="flex w-full h-full gap-8 items-baseline justify-center inset-x-0 bottom-0">
        <button
          className="hover:text-indigo-600 transition-colors"
          onClick={previousSkillGroup}
        >
          ← Previous
        </button>
        <h2 className="text-5xl font-bold">Skills</h2>
        <button
          className="hover:text-indigo-600 transition-colors"
          onClick={nextSkillGroup}
        >
          Next →
        </button>
      </div>
    </Section>
  );

                              
};

const ContactSection = () => {
  return (
    <Section>
    <h2 className="flex justify-center h-full text-4xl font-bold text-center">Old boring Contact and Connect <br/>or<br/> Chat with my AI Assistant below!</h2>
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2">
        <div className="mt-8 p-8 rounded-md bg-white w-96 max-w-full">

        <h2 className="text-4xl font-bold text-center">Send me a message</h2>
          <form>
            <label htmlFor="name" className="font-medium text-gray-900 block mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
            />
            <label
              htmlFor="email"
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
              htmlFor="message"
              className="font-medium text-gray-900 block mb-1 mt-8"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              className="h-32 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 p-3"
            />
            <button className="bg-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg mt-16 hover:bg-indigo-700 transition-colors duration-300 ease-in-out">
              Submit
            </button>
          </form>
        </div>
      </div>
      <hr className="md:block border-black my-8 w-0 h-full mx-8" />
      <div className="mt-8 p-8 rounded-md bg-white w-96 max-w-full">

      <h2 className="text-4xl font-bold text-center">Connect with me</h2>
        <div className="mt-8 flex justify-center space-x-6">
          <a
            href="https://github.com/zbram101"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800"
          >
            <img
              src="images/github.png"
              alt="GitHub"
              className="w-30 h-20 transform hover:scale-110 transition-transform duration-300 ease-in-out"
            />
          </a>
          <a
            href="https://linkedin.com/in/bharadwaj-ramachandran-51bb32a3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800"
          >
            <img
              src="images/linkdin.png"
              alt="LinkedIn"
              className="w-30 h-20 transform hover:scale-110 transition-transform duration-300 ease-in-out"
            />
          </a>
          {/* Add other social media links similarly */}
        </div>
      </div>
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
  
