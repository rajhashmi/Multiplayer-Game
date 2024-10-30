import { useKeyboardControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Opponent from "../Opponent";

export default function Player({ playerColor, webSocketConnection, roomID }) {
  const body = useRef();
  const [visible, setVisible] = useState(true);
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const smoothCameraPosition = useRef(new THREE.Vector3(10, 15, 10));
  const smoothCameraTarget = useRef(new THREE.Vector3());

  const impulse = useRef({ x: 0, y: 0, z: 0 });
  const torque = useRef({ x: 0, y: 0, z: 0 });

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.3, 3), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: playerColor }),
    []
  );

  useEffect(() => {
    const unsubscribe = subscribeKeys(() => {});
    return () => unsubscribe();
  }, [subscribeKeys]);

  const removeBody = useCallback(() => {
    if (body.current) {
      body.current.setTranslation({ x: 0, y: -100, z: 0 }, true);
    }
  }, []);

 


  useFrame((state, delta) => {
    if (!visible) return;
    let needPlayerPositionChange = false;

    const { forward, backward, leftward, rightward } = getKeys();
    const imp = impulse.current;
    const torq = torque.current;

    imp.x = imp.y = imp.z = 0;
    torq.x = torq.y = torq.z = 0;

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      imp.z -= impulseStrength;
      torq.x -= torqueStrength;
      needPlayerPositionChange = true
    }
    if (rightward) {
      imp.x += impulseStrength;
      torq.z -= torqueStrength;
      needPlayerPositionChange = true
    }
    if (backward) {
      imp.z += impulseStrength;
      torq.x += torqueStrength;
      needPlayerPositionChange = true
    }
    if (leftward) {
      imp.x -= impulseStrength;
      torq.z += torqueStrength;
      needPlayerPositionChange = true
    }

    if (body.current) {
      if(needPlayerPositionChange){ 
        body.current.applyImpulse(imp, true);
        body.current.applyTorqueImpulse(torq, true);
      }

      const bodyPosition = body.current.translation();

      if(webSocketConnection){
        console.log("web is there")
        if(webSocketConnection.readyState === WebSocket.OPEN){
          webSocketConnection.send(JSON.stringify({type: "player_moved", bodyPosition , playerIdentity : playerColor , roomID}))
        }
      }

      const cameraPosition = new THREE.Vector3()
        .copy(bodyPosition)
        .add(new THREE.Vector3(0, 2.5, 5));
      const cameraTarget = new THREE.Vector3()
        .copy(bodyPosition)
        .add(new THREE.Vector3(0, 0.25, 0));

      smoothCameraPosition.current.lerp(cameraPosition, 3 * delta);
      smoothCameraTarget.current.lerp(cameraTarget, 3 * delta);

      state.camera.position.copy(smoothCameraPosition.current);
      state.camera.lookAt(smoothCameraTarget.current);

      if (bodyPosition.y < 0) {
        setVisible(false);
        removeBody();
      }
    }
  });

  return (
    <>
    <RigidBody
      colliders="ball"
      canSleep={false}
      restitution={0.6} 
      friction={0.3} 
      linearDamping={0.1} 
      angularDamping={0.1} 
      position={[1, 5, 0]}
    >
      
      <Opponent  geometry={geometry}
        webSocketConnection={webSocketConnection}
        roomID={roomID}
        />
    </RigidBody>
    <RigidBody
      ref={body}
      colliders="ball"
      canSleep={false}
      restitution={0.6}
      friction={0.3}
      linearDamping={0.1}
      angularDamping={0.1}
      position={[0, 5, 0]}
    >
      <mesh
        castShadow
        geometry={geometry}
        material={material}
        visible={visible}
      />
    </RigidBody>
    
    </>
    
    
  );
}
