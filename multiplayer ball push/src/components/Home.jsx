import { useEffect, useState } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

function Home() {
  
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [generatedRoomId, setGeneratedRoomId] = useState("");

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substr(2, 9);
    setGeneratedRoomId(newRoomId);
    navigate(`/game/${newRoomId}`);
  };
  useEffect(()=>{
    useGLTF.preload("/gameArena.glb");
  }, [])

  const handleJoinRoom = () => {
    if (!roomCode) {
      alert("Please enter a valid room code.");
      return;
    }
    navigate(`/game/${roomCode}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRoomId);
   
  };

  return (
    
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

          </div>

          

          <div className="image-container">
            <img src="/landing.png" alt="Landing" />
          </div>
        </div>
      </Html>
    
  );
}

export default Home;
