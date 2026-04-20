import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Scroll, ScrollControls } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { Cursor } from "./components/Cursor";
import { Interface } from "./components/Interface";
import { Menu } from "./components/Menu";
import { SceneCharacter } from "./components/SceneCharacter";
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
      <div className="app-shell">
        <Canvas className="scene-canvas" shadows camera={{ position: [0, 3, 10], fov: 42 }}>
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
        <div className="character-overlay">
          <Canvas
            className="character-overlay-canvas"
            camera={{ position: [0, 3, 10], fov: 42 }}
            gl={{ alpha: true, antialias: true }}
            dpr={[1, 1.6]}
          >
            <ambientLight intensity={0.95} />
            <directionalLight position={[4, 6, 5]} intensity={1.15} color="#fff4e8" />
            <directionalLight position={[-5, 3, -2]} intensity={0.42} color="#b9d9d6" />
            {section < 5 && <SceneCharacter section={section} />}
          </Canvas>
        </div>
      </div>
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
