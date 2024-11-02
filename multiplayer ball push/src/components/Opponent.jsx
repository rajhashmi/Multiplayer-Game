import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function Opponent({ webSocketConnection, geometry }) {
  const [boxes, setBoxes] = useState([]);
  const [positionUpdateTrigger, setPositionUpdateTrigger] = useState(0);  
  const opponentPosition = useRef([]);

  useEffect(() => {
    if (!webSocketConnection) return;

    const handleMessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "new_player") {
        const opponentInfo = {
          playerIdentity: message.playerColor,
          playerPosition: message.playerPosition,
        };
        opponentPosition.current.push(opponentInfo);
        setBoxes((prev) => [...prev, message.playerColor]);
      } else if (message.type === "opponent_position") {
        opponentPosition.current.forEach((el) => {
          if (el.playerIdentity === message.PlayerIdentity.playerColor) {
            el.playerPosition = message.PlayerIdentity.bodyPosition;
          }
        });
        setPositionUpdateTrigger((prev) => prev + 1);  
      }
    };

    webSocketConnection.addEventListener("message", handleMessage);

    return () => {
      webSocketConnection.removeEventListener("message", handleMessage);
    };
  }, [webSocketConnection]);

  return (
    <>
      {boxes.map((el, index) => (
       
        <mesh
           geometry={geometry}
           key={index}
           position={[
             opponentPosition.current[index].playerPosition.x,
             opponentPosition.current[index].playerPosition.y,
             opponentPosition.current[index].playerPosition.z,
           ]}
         >
           <meshStandardMaterial color={el} />
         </mesh>
     
      ))}
    </>
  );
}

export default Opponent;
