import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Scroll, ScrollControls } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { Cursor } from "./components/Cursor";
import { Interface } from "./components/Interface";
import { Menu } from "./components/Menu";
import { ScrollManager } from "./components/ScrollManager";
import { framerMotionConfig } from "./components/config";

function App() {
  const [section, setSection] = useState(0);
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    setMenuOpened(false);
  }, [section]);

  return (
    <MotionConfig transition={{ ...framerMotionConfig }}>
      <Canvas shadows camera={{ position: [0, 3, 10], fov: 42 }}>
        <color attach="background" args={["#0b1219"]} />
        <ScrollControls pages={6} damping={0.12}>
          <ScrollManager section={section} onSectionChange={setSection} />
          <Scroll>
            <Experience
              onSectionChange={setSection}
              section={section}
              menuOpened={menuOpened}
            />
          </Scroll>
          <Scroll html>
            <Interface onSectionChange={setSection} />
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
  );
}

export default App;
