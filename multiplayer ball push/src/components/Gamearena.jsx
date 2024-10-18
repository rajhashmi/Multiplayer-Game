import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import Model from "./models/Model.jsx";
import Player from "./player/Player.jsx";
const randomColor = () =>
  "#" +
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");

function GameArena() {
  const ws = useRef(null);
  const playerColor = randomColor();
  const [message, setMessage] = useState("");
  const [roomCreated, setRoomCreated] = useState(false);
  const roomID = window.location.pathname.replace("/game/", "");

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      createRoom(roomID);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.message) {
        setMessage(data.message);
        setTimeout(() => setMessage(""), 2000);
      }

      if (data.error) {
        alert(data.error);
      }

      if (data.type === "room_created") {
        setRoomCreated(true);
        joinRoom(roomID);
      } else if (data.type === "room_exists") {
        joinRoom(roomID);
      }

      // if (data.type === "player_joined") {

      // } else if (data.type === "player_left") {

      // }
    };

    return () => {
      ws.current.close();
    };
  }, [roomID]);

  const createRoom = (roomId) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "create_room", roomId, playerColor })
      );
    }
  };

  const joinRoom = (roomId) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "join_room", roomId, playerColor })
      );
    }
  };

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 45, near: 0.1, far: 200, position: [-35, 29, 11] }}
    >
      <OrbitControls />
      <SceneLights />
      <Physics gravity={[0, -9.81, 0]}>
        <RigidBody type="fixed" colliders="hull">
          <Model />
        </RigidBody>
        <Player />
      </Physics>
    </Canvas>
  );
}

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

export default GameArena;
