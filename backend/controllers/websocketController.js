import { WebSocketServer, WebSocket } from "ws";

const rooms = new Map();
const webSocketServer = new WebSocketServer({ port: 8080 });

const setupWebSocket = () => {
  webSocketServer.on("connection", (ws) => {
    ws.on("message", (data) => {
      try {
        const parsedData = JSON.parse(data);
        const { type, roomId, playerColor } = parsedData;

        if(type === "request_player"){
          const roomID = parsedData.roomID
          const retrivedData = rooms.get(roomID)
          if(retrivedData.size > 1){
            const playersPostion = [];
          retrivedData.forEach((players)=>{
            if(ws !== players){
              playersPostion.push(players.PlayerIdentity)
            }
            })
            
            if(ws.readyState === WebSocket.OPEN){

           

              ws.send(JSON.stringify({ type: "requested_player", playerDetails: playersPostion }));

            }
          }
        }


        if (type === "create_room") {
          if (!rooms.has(roomId)) {
            ws.PlayerIdentity = {
              playerColor,
              bodyPosition: { x: 0, y: 0, z: 0 },
              roomId,
            };
            rooms.set(roomId, new Set([ws]));
            ws.send(
              JSON.stringify({
                type: "room_created",
                message: `Room ${roomId} created!`,
              })
            );
            console.log(roomId, "fhdfhdfh")


          } else {
            const room = rooms.get(roomId);
            console.log(room);
            
            ws.PlayerIdentity = {
              playerColor,
              bodyPosition: { x: 0, y: 0, z: 0 },
              roomId,
            };
            room.add(ws);

            const message = {
              type: "new_player",
              playerColor: ws.PlayerIdentity.playerColor,
              playerPosition:  ws.PlayerIdentity.bodyPosition
            };
            broadcastToRoom(roomId, message, null);
          }

      
        }
       
        if (type === "player_moved") {
          const { bodyPosition, playerIdentity, roomID } = parsedData;
          const room = rooms.get(roomID);
          if (room) {
            room.forEach((player) => {
              if (player.PlayerIdentity.playerColor === playerIdentity) {
                player.PlayerIdentity.bodyPosition = bodyPosition;
                // broadcastToRoom(roomID, {PlayerIdentity: player.PlayerIdentity, type: "opponent_position"}, ws);
              }
            }); 
          }
        }
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    });

    ws.on("close", () => {
      rooms.forEach((clients, roomId) => {
        clients.delete(ws);
        if (clients.size === 0) {
          rooms.delete(roomId);
        } else {
          broadcastToRoom(
            roomId,
            { type: "player_left", message: `A player has left the room.` },
            ws
          );
        }
      });
    });
  });
};

const broadcastToRoom = (roomID, message, sender = null) => {
console.log(roomID, message)
  const clients = rooms.get(roomID);
  if (clients && clients.size > 0) {
    clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
};

export { setupWebSocket };
