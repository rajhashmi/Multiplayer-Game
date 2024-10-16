import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, KeyboardControls } from '@react-three/drei';
import { StrictMode, useEffect } from 'react';
import * as THREE from 'three';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
      ]}
    >
      <Canvas
        shadows
        dpr={[1, 2]}  
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-35, 29, 11],
        }}
      >
        <OrbitControls/>
        <SceneLights />
        <App />
      </Canvas>
    </KeyboardControls>
  </StrictMode>
);

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        intensity={1.5}  
        position={[8.5, 25, 15]}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-top={40}
        shadow-camera-right={40}
        shadow-camera-bottom={-40}
        shadow-camera-left={-40}
        shadow-bias={-0.001}
      />
    </>
  );
}
