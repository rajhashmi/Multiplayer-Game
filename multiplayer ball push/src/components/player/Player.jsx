import { CameraShake, useKeyboardControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Player() {
  const body = useRef();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const smoothCameraPosition = useRef(new THREE.Vector3(10, 15, 10));
  const smoothCameraTarget = useRef(new THREE.Vector3());

  const impulse = { x: 0, y: 0, z: 0 };
  const torque = { x: 0, y: 0, z: 0 };

  useEffect(() => {
    const unsubscribe = subscribeKeys(() => {});  
    return () => unsubscribe();
  }, [subscribeKeys]);

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    impulse.x = impulse.y = impulse.z = 0;
    torque.x = torque.y = torque.z = 0;

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

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

    if (body.current) {
      body.current.applyImpulse(impulse, true);
      body.current.applyTorqueImpulse(torque, true);

      const bodyPosition = body.current.translation();

      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(bodyPosition);
      cameraPosition.z += 5; 
      cameraPosition.y += 2.5;

      const cameraTarget = new THREE.Vector3();
      cameraTarget.copy(bodyPosition);
      cameraTarget.y += 0.25;

      smoothCameraPosition.current.lerp(cameraPosition, 3 * delta); 
      smoothCameraTarget.current.lerp(cameraTarget, 3 * delta);

      state.camera.position.copy(smoothCameraPosition.current);
      state.camera.lookAt(smoothCameraTarget.current);
    }
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders="ball"
        canSleep={false}
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
        position={[0, 5, 0]}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </RigidBody>
    </>
  );
}
