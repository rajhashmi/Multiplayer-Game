import { useEffect, useState, useRef } from "react";

function Opponent({ geometry, webSocketConection, roomID }) {
  const [playerOpponent, setPlayerOpponent] = useState([]);
  const connectionRef = useRef(webSocketConection); // Use ref for stable reference

  // Request player information based on roomID
  const requestPlayer = () => {
    if (connectionRef.current?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: "request_player",
        roomID: roomID,
      });
      connectionRef.current.send(message);
    }
  };

  useEffect(() => {
    const handleIncomingMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "new_player") {
        setPlayerOpponent((prev) =>
          prev.includes(data.playerColor) ? prev : [...prev, data.playerColor]
        );
      }

      if (data.type === "requested_player") {
        setPlayerOpponent((prev) => {
          const newPlayers = data.playerDetails.filter(
            (player) => !prev.includes(player)
          );
          return [...prev, ...newPlayers];
        });
      }
    };

    connectionRef.current = webSocketConection;

    if (connectionRef.current) {
      connectionRef.current.addEventListener("message", handleIncomingMessage);
    }

    requestPlayer();

 
    return () => {
      connectionRef.current?.removeEventListener(
        "message",
        handleIncomingMessage
      );
    };
  }, [webSocketConection, roomID]);

  return <>{console.log(playerOpponent)}</>;  
}

export default Opponent;
