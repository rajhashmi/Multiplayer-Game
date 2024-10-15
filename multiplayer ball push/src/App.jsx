import './App.css';
import Model from './components/models/Model';
import { Physics, RigidBody } from '@react-three/rapier';
import Player from './components/player/Player';
function App() {
  return (
    <>
      <Physics 
        gravity={[0, -9.81, 0]} 
        timeStep="vary"
         
      >
        <RigidBody type="fixed" colliders="hull" >
          <Model />
        </RigidBody>

        
          <Player />
      </Physics>
    </>
  );
}

export default App;
