import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const PORT = process.env.PORT || 3000;

const webSocketServer = new WebSocketServer({ port: 8080 });

webSocketServer.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.position) {
        console.log("Received position:", parsedData.position);
      } else {
        console.log("No position data received.");
      }
    } catch (error) {
      console.error("Error parsing data:", error);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));

  ws.send("Welcome to the WebSocket server!");
});

app.get("/", (req, res) => {
  res.json({ message: "Server is up and running!" });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
