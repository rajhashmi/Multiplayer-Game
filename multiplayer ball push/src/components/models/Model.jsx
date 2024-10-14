import { useGLTF, useTexture } from "@react-three/drei";

function Model() {
  const model = useGLTF('./arena.glb');  // Load the GLTF model
  const modelTexture = useTexture('./gameTexture2.png');  // Load the texture
  modelTexture.flipY = false;

  // Traverse the model and apply the texture to existing materials
  model.scene.traverse((child) => {
    if (child.isMesh && child.material) {  
        
        child.material.map = modelTexture;  // Replace the existing texture map
      child.material.needsUpdate = true;  // Ensure the material refreshes
    }       
  });

  return <primitive object={model.scene} />;  // Render the model
}

export default Model;
