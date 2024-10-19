import { createRoot } from "react-dom/client";
import { KeyboardControls } from "@react-three/drei";
import "./App.css"

import Home from "./components/Home.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GameArena from "./components/Gamearena.jsx";

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:id" element={<GameArena />} />
        </Routes>
      </KeyboardControls>
    </Router>
  </>
);
