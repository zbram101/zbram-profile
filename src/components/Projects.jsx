import { Image, Text, Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import * as THREE from 'three';
import { motion } from "framer-motion-3d";
import { atom, useAtom } from "jotai";
import { useEffect, useState, useRef } from "react";


const projects = [
    {
        title: "Skipped",
        status: "Exited",
        description: "Lead development of recruiting application",
        category: "Recruiting SAAS",
        link:null,
        accomplishments: [
          "Lead development efforts with PR review",
          "Architected and designed candidate and job description matching logic",
          "Learned the importance of market testing before building out the product"
        ]
    },
    {
        title: "Skirmesh",
        status: "Exited - Sold Equity",
        description: "Architected and redesigned the technical and product architecture to make it a viable product",
        category: "IRL Gaming SAAS",
        link:"https://play.skirmesh.net/public/home",
        accomplishments: [
          "Revamped the project with software engineering concepts like web sockets and APIs",
          "Aided in transforming the project into a money-making business",
          "Acquired initial customers to kickstart the project"
        ]
    },
    {
        title: "Fiji Fry House",
        status: "Active",
        description: "Managing IT infrastructure, online presence, and operational efficiency for a friend's restaurant",
        category: "Restaurant",
        link:"https://fijifryhouse.com/",
        accomplishments: [
          "Providing IT support and management for the restaurant",
          "Enhancing online presence for the restaurant",
          "Improving operational efficiency through IT solutions"
        ]
    },
    {
        title: "Personal Bot",
        status: "Active",
        description: "Working on a project to train LLMs to promote and answer questions for candidates",
        category: "Machine Learning",
        link:"https://www.bharadwajramachandran.com/",
        accomplishments: [
          "Developing a personalized bot to assist candidates",
          "Training Language Model Models (LLMs) to interact effectively",
          "Helping candidates with their questions and concerns"
        ]
    }
  ];export const Projects = () => {
    const [currentProject, setCurrentProject] = useState(0);
    const { viewport } = useThree();
  
    const openProjectDetails = (index) => {
      setCurrentProject(index);
    };
  
    return (
      <group position-y={-viewport.height * 3 - 1.6}>
        {projects.map((project, index) => (
          <mesh
            key={index}
            position={[(index - projects.length / 2) * 1.4 + 0.9, 4, 1]}
            onClick={() => openProjectDetails(index)}
          >
            <boxBufferGeometry args={[1.2, .8, 0]} />
            <meshStandardMaterial />
            <Html position={[(index - projects.length / 2) * 2.2 -.2, -viewport.height * 6 +.8, 1]}>
              <div className="p-6 rounded-md shadow-md bg-white" style={{ width: "200px" }}>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-700 text-sm">{project.category}</p>
                <p className="text-gray-700 text-sm">{project.status}</p>
              </div>
            </Html>
          </mesh>
        ))}
        {currentProject !== null && (
          <Html position-y={-viewport.height * 8 - 10} center>
            <div style={{ minWidth: "600px" }} className="p-6 mt-8 rounded-md shadow-md bg-white">
              <h3 className="text-center text-2xl font-semibold mb-4">
                {projects[currentProject].title}
              </h3>
              {projects[currentProject].link && (
                <p className="text-center text-blue-500 text-sm">
                  <a href={projects[currentProject].link} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </p>
              )}
              <p>{projects[currentProject].description}</p>
              <ul className="list-disc list-inside mt-4">
                {projects[currentProject].accomplishments.map((accomplishment, index) => (
                  <li key={index}>{accomplishment}</li>
                ))}
              </ul>
              
            </div>
          </Html>
        )}
      </group>
    );
  };
  