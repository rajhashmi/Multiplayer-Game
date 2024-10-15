import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

function Model() {
  const { scene } = useGLTF("./gamearena.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.receiveShadow = true; 

        if (child.material.vertexColors) {
          child.material.vertexColors = THREE.VertexColors;
        }

        child.material.color.convertSRGBToLinear();

        // Ensure material updates are reflected
        child.material.needsUpdate = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={2} />;
}

export default Model;
