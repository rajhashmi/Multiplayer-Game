import './App.css';
import Model from './components/models/Model';
import { Physics, RigidBody } from '@react-three/rapier';
import Player from './components/player/Player';

function App() {
  return (
    <>
      <Physics gravity={[0, -9.81, 0]}> {/* Normal gravity */}
        {/* Fixed Ground Model */}
        <RigidBody type="fixed" colliders="hull">
          <Model />
        </RigidBody>

        {/* Lightweight Ball (Icosahedron) */}
        <RigidBody
          position={[1, 5, 2]}
          colliders="ball"           // Ball collider for round shape
          mass={0.2}                 // Lightweight but not too light
          friction={0.05}            
          restitution={0.7}          
          linearDamping={0.1}       
          angularDamping={0.1}       
        >
          <mesh castShadow receiveShadow>
            <icosahedronGeometry args={[0.3, 3]} /> {/* Ball-like geometry */}
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        <Player />
      </Physics>
    </>
  );
}

export default App;
