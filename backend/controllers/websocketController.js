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
            rooms.set(roomId, new Set());
            ws.send(
              JSON.stringify({
                type: "room_created",
                message: `Room ${roomId} created!`,
              })
            );
          } else {
            ws.send(
              JSON.stringify({
                type: "room_exists",
                message: `Room ${roomId} already exists!`,
              })
            );
          }
        }

        if (type === "join_room") {
          if (rooms.has(roomId)) {
            const room = rooms.get(roomId);
            room.add(ws);

            ws.send(JSON.stringify({ message: `Joined room: ${roomId}` }));

            if (room.size > 1) {
              broadcastToRoom(
                roomId,
                {
                  type: "player_joined",
                  message: `A new player has joined the room.`,
                  playerColor,
                },
                ws
              );
            }
          } else {
            ws.send(JSON.stringify({ error: "Room not found!" }));
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

  if (clients) {
    clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
};

export { setupWebSocket };
