import { useRef, useEffect, useState, memo } from "react";
import { Physics, RigidBody } from "@react-three/rapier";
import Model from "./models/Model.jsx";
import Player from "./player/Player.jsx";
const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

function GameArena() {
  const ws = useRef(null);
  const [roomCreated, setRoomCreated] = useState(false);
  const playerColor = useRef();
  const roomID = window.location.pathname.replace("/game/", "");

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      const color = randomColor();
      playerColor.current = color;
      setRoomCreated(true);
      createRoom(roomID);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) alert(data.error);
      if (data.type === "room_created" && !roomCreated) {
        console.log(data);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      alert("Unable to connect to the server.");
    };

    return () => ws.current.close();
  }, [roomID]);

  const createRoom = (roomId) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "create_room", roomId, playerColor: playerColor.current })
      );
    }
  };

  return (
    <>
      {roomCreated && (
        <Scene
          playerColor={playerColor.current}
          ws={ws.current}
          roomID={roomID}
        />
      )}
    </>
  );
}

const Scene = memo(({ playerColor, ws, roomID }) => (
  <>
    <SceneLights />
    <Physics gravity={[0, -9.81, 0]} debug>
      <RigidBody type="fixed" colliders="hull">
        <Model />
      </RigidBody>
      <Player
         webSocketConnection={ws}  
         playerColor={playerColor}
         roomID={roomID}
      />
 
    </Physics>
  </>
));

function SceneLights() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight
        castShadow
        intensity={1.5}
        position={[8.5, 10, 15]}
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
