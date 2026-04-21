import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Scroll, ScrollControls } from "@react-three/drei";
import { Experience } from "./components/Experience";
import { Cursor } from "./components/Cursor";
import { Interface, SECTION_IDS } from "./components/Interface";
import { Menu } from "./components/Menu";
import { ScrollManager } from "./components/ScrollManager";
import { framerMotionConfig } from "./components/config";
import { useViewport } from "./hooks/useViewport";

function App() {
  const [section, setSection] = useState(0);
  const [menuOpened, setMenuOpened] = useState(false);
  const { isMobile } = useViewport();

  useEffect(() => {
    setMenuOpened(false);
  }, [section]);

  function handleSectionChange(nextSection) {
    setSection(nextSection);

    if (!isMobile || typeof document === "undefined") {
      return;
    }

    const targetId = SECTION_IDS[nextSection];
    const targetNode = targetId ? document.getElementById(targetId) : null;

    if (!targetNode) {
      return;
    }

    requestAnimationFrame(() => {
      targetNode.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <MotionConfig transition={{ ...framerMotionConfig }}>
      {isMobile ? (
        <main className="mobile-app-shell">
          <Interface onSectionChange={handleSectionChange} />
        </main>
      ) : (
        <>
          <Canvas shadows camera={{ position: [0, 3, 10], fov: 42 }}>
            <color attach="background" args={["#0b1219"]} />
            <ScrollControls pages={6} damping={0.12}>
              <ScrollManager section={section} onSectionChange={handleSectionChange} />
              <Scroll>
                <Experience
                  onSectionChange={handleSectionChange}
                  section={section}
                  menuOpened={menuOpened}
                />
              </Scroll>
              <Scroll html>
                <Interface onSectionChange={handleSectionChange} />
              </Scroll>
            </ScrollControls>
          </Canvas>
          <Cursor />
        </>
      )}
      <Menu
        onSectionChange={handleSectionChange}
        menuOpened={menuOpened}
        setMenuOpened={setMenuOpened}
      />
    </MotionConfig>
  );
}

export default App;
