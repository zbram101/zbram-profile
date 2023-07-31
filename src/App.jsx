import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Scroll, ScrollControls } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { Cursor } from "./components/Cursor";
import { Interface } from "./components/Interface";
import { ScrollManager } from "./components/ScrollManager";
import { Menu } from "./components/Menu";
import { framerMotionConfig } from "./components/config";

function App() {

  const [section, setSection] = useState(0);
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    setMenuOpened(false);
  }, [section]);



  return (
    <>
     <MotionConfig
        transition={{
          ...framerMotionConfig,
        }}
      >
    <Canvas shadows camera={{ position: [0, 3, 10], fov: 42 }}>
      <color attach="background" args={["#ececec"]} />
      <ScrollControls pages={6} damping={0.1}>
        <ScrollManager section={section} onSectionChange={setSection} />
        <Scroll>
          <Experience onSectionChange={setSection} section={section} menuOpened={menuOpened} />
        </Scroll>
        <Scroll html>
          <Interface onSectionChange={setSection} ></Interface>
        </Scroll>
      </ScrollControls>
    </Canvas>
    <Menu
          onSectionChange={setSection}
          menuOpened={menuOpened}
          setMenuOpened={setMenuOpened}
        />
      <Cursor />
    </MotionConfig>
    </>
  );
}

export default App;
