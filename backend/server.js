import express from "express";
import { setupWebSocket } from "./controllers/websocketController.js";

const app = express();
const PORT = process.env.PORT || 3000;

setupWebSocket();

app.get("/", (req, res) => {
  res.json({ message: "Server is up and running!" });
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
