import { createRoot } from "react-dom/client";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import "./App.css";

import Home from "./components/Home.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GameArena from "./components/Gamearena.jsx";
import { Canvas } from "@react-three/fiber";

createRoot(document.getElementById("root")).render(
  <>
    <Router>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
          { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
          { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        ]}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ fov: 45, near: 0.1, far: 200, position: [-35, 29, 11] }}
        >
          <OrbitControls/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:id" element={<GameArena />} />
          </Routes>
        </Canvas>
      </KeyboardControls>
    </Router>
  </>
);
