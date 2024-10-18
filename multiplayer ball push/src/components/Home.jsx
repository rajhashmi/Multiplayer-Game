import { useState } from "react";
import { Html, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [generatedRoomId, setGeneratedRoomId] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substr(2, 9);
    setGeneratedRoomId(newRoomId);
    navigate(`/game/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!roomCode) {
      alert("Please enter a valid room code.");
      return;
    }
    navigate(`/game/${roomCode}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRoomId);
    setMessage("Room code copied to clipboard!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 45, near: 0.1, far: 200, position: [-35, 29, 11] }}
    >
      <Html fullscreen>
        <div className="background">
          <div
            className="room-container"
            style={{
              position: "absolute",
              left: "20px",
              top: "20px",
              zIndex: 10,
            }}
          >
            <button onClick={() => setShowInput(true)}>Join Room</button>

            {showInput && (
              <div className="join-room-container">
                <input
                  type="text"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                />
                <button onClick={handleJoinRoom}>Join</button>
              </div>
            )}

            <button onClick={handleCreateRoom}>Create Room</button>

            {generatedRoomId && (
              <div style={{ marginTop: "10px" }}>
                <p>Room Code: {generatedRoomId}</p>
                <button onClick={copyToClipboard}>Copy Room Code</button>
              </div>
            )}

            {message && <p>{message}</p>}
          </div>

          <div className="text-Container">
            <Canvas>
              <Text
                castShadow
                font="./bebas-neue-v9-latin-regular.woff"
                scale={2.3}
                position={[-1.3, -2, 0]}
              >
                Multiplayer Push Game
                <meshBasicMaterial toneMapped={false} />
              </Text>
            </Canvas>
          </div>

          <div className="image-container">
            <img src="/landing.png" alt="Landing" />
          </div>
        </div>
      </Html>
    </Canvas>
  );
}

export default Home;
