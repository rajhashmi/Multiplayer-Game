import './App.css';
import Model from './components/models/Model';
import { Physics, RigidBody } from '@react-three/rapier';
import Player from './components/player/Player';

function App() {
  return (
    <>
      <Physics gravity={[0, -9.81, 0]}>  
        <RigidBody type="fixed" colliders="hull">
          <Model />
        </RigidBody>

        <RigidBody
          position={[1, 5, 2]}
          colliders="ball"           
          mass={0.2}                  
          friction={0.05}            
          restitution={0.7}          
          linearDamping={0.1}       
          angularDamping={0.1}       
        >
          <mesh castShadow receiveShadow>
            <icosahedronGeometry args={[0.3, 3]} />  
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        <Player />
      </Physics>
    </>
  );
}

export default App;
