import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import { AllSkills } from "./Skills";
import { Projects } from "./Projects";
import { SectionArtworkStrip } from "./SectionArtworkStrip";
import { framerMotionConfig } from "./config";

export const Experience = ({ menuOpened, section = 0 }) => {
  const cameraPositionX = useMotionValue();
  const cameraLookAtX = useMotionValue();

  useEffect(() => {
    animate(cameraPositionX, menuOpened ? -4.5 : 0, {
      ...framerMotionConfig,
    });
    animate(cameraLookAtX, menuOpened ? 4.5 : 0, {
      ...framerMotionConfig,
    });
  }, [cameraLookAtX, cameraPositionX, menuOpened]);

  useFrame((state) => {
    state.camera.position.x = cameraPositionX.get();
    state.camera.lookAt(cameraLookAtX.get(), 0, 0);
  });

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 5]} intensity={1.35} color="#fff4e8" />
      <directionalLight position={[-5, 3, -2]} intensity={0.6} color="#b9d9d6" />

      <SectionArtworkStrip />
      <AllSkills />
      <Projects />
    </>
  );
};
