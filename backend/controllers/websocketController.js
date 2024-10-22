import { WebSocketServer, WebSocket } from "ws";

const rooms = new Map();
const webSocketServer = new WebSocketServer({ port: 8080 });

const setupWebSocket = () => {
  webSocketServer.on("connection", (ws) => {
    ws.on("message", (data) => {
      try {
        const parsedData = JSON.parse(data);
        const { type, roomId, playerColor } = parsedData;

        if (type === "create_room") {
          if (!rooms.has(roomId)) {
            ws.PlayerIdentity = { playerColor, bodyPosition: {
              x: 0,
              y: 0,
              z: 0
            } };
            rooms.set(roomId, new Set([ws]));
            ws.send(
              JSON.stringify({
                type: "room_created",
                message: `Room ${roomId} created!`,
              })
            );
          } else {
            const room = rooms.get(roomId);
            ws.PlayerIdentity = { playerColor, bodyPosition: {
              x: 0,
              y: 0,
              z: 0
            } };
            room.add(ws);
        
            const message = {
              type: "new_player", 
              playerColor: ws.PlayerIdentity.playerColor,
            };
        
            broadcastToRoom(roomId, message, ws);
          }
        }
        

        if (type === "player_moved") { 
          const bodyPosition = parsedData.bodyPosition;
          const roomId = parsedData.roomID;
          const roomPlayer = rooms.get(roomId);
          if(roomPlayer.size){
            roomPlayer.forEach((child)=>{
              if(child.PlayerIdentity.playerColor.current === parsedData.playerIdentity){
                child.PlayerIdentity.bodyPosition.x = bodyPosition.x
                child.PlayerIdentity.bodyPosition.y = bodyPosition.y
                child.PlayerIdentity.bodyPosition.z = bodyPosition.z
              }
            })
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
            {
              type: "player_left",
              message: `A player has left the room.`,
            },
            ws
          );
        }
      });
    });
  });
};

const broadcastToRoom = (roomID, message, sender) => {
  const clients = rooms.get(roomID);

  if (clients && clients.size > 1) {
    clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        console.log("doing") 
        client.send(JSON.stringify(message)); 
      }
    }); 
  }
};
 
export { setupWebSocket };
