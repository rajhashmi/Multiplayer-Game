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

          } else {
            const room = rooms.get(roomId);
            ws.PlayerIdentity = {
              playerColor,
              bodyPosition: { x: 0, y: 0, z: 0 },
              roomId,
            };
            room.add(ws);

            const message = {
              type: "new_player",
              playerColor: ws.PlayerIdentity.playerColor,
              playerAlreadyInRoom: room.size
            };
            broadcastToRoom(roomId, message, null);
          }

      
        }
       
        if (type === "player_moved") {
          const { bodyPosition, playerColor, roomId } = parsedData;
          const room = rooms.get(roomId);
          console.log("working")
          if (room) {
            room.forEach((player) => {
              if (player.PlayerIdentity.playerColor === playerColor) {
                player.PlayerIdentity.bodyPosition = bodyPosition;
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
