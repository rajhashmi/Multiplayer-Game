import { CameraShake, useKeyboardControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three'

export default function Player() {
  const body = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  
 

  const impulse = { x: 0, y: 0, z: 0 };
  const torque = { x: 0, y: 0, z: 0 };

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    // Reset impulse and torque values
    impulse.x = impulse.y = impulse.z = 0;
    torque.x = torque.y = torque.z = 0;

    const impulseStrength = 25 * delta;
    const torqueStrength = 12.5 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    // Apply impulse and torque only if needed to save computation
    if (body.current) {
      body.current.applyImpulse(impulse, true);
      body.current.applyTorqueImpulse(torque, true);
    }
 
    
  });

  return (
    <RigidBody
      ref={body}
      colliders="ball"
      canSleep={false}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh position={[0, 19, 0]} castShadow>
        <icosahedronGeometry args={[1, 3, 3]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
