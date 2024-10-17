import { WebSocketServer } from "ws";

const clients = new Map(); 
const rooms = new Map();    

const webSocketServer = new WebSocketServer({ port: 8080 });

const setupWebSocket = () => {
  webSocketServer.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (data) => {
      try {
        const parsedData = JSON.parse(data);

        if (parsedData.type === "create_room") {
          const roomId = parsedData.roomId;
          console.log(`Creating room: ${roomId}`);

          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());  
          }
          rooms.get(roomId).add(ws);  
          ws.send(JSON.stringify({ message: `Room ${roomId} created!` }));
        }

        if (parsedData.type === "join_room") {
            console.log(rooms);

          const roomId = parsedData.roomId;
          if (rooms.has(roomId)) {
            rooms.get(roomId).add(ws);  
            ws.send(JSON.stringify({ message: `Joined room: ${roomId}` }));
          } else {
            ws.send(JSON.stringify({ error: "Room not found!" }));
          }
        }
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      rooms.forEach((clients, roomId) => {
        if (clients.has(ws)) clients.delete(ws);
      });
    });
  });
};

export { setupWebSocket };
