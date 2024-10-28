import WebSocket, { WebSocketServer } from "ws";
import crypto from "node:crypto";
import messageHandler from "./messageHandler.ts";

const startWs = () => {
  const wss = new WebSocketServer({ port: 3000 });
  const clients = new Map();

  // After starting the program displays websocket parameters
  console.log("wss parameters =>", wss.address());

  wss.on("connection", function connection(ws: WebSocket, request, client) {
    const clientId = crypto.randomUUID();
    clients.set(clientId, ws);
    console.log(`Client ${clientId} connected to ws`);

    ws.on("message", (clientMessage: string) => {
      try {
        const message = JSON.parse(clientMessage);
        // After each received command program should display the command and result
        console.log("client message:", message.type, message.data);

        messageHandler(message.type, message.data, ws, wss);
      } catch (error) {
        console.log("ws onmessage: error parsing data", error);
      }
    });

    ws.on("error", console.error);

    // Handle websocket clients connection/disconnection properly
    ws.on("close", () => {
      clients.delete(clientId);
      console.log(`Client ${clientId} disconnected`);
    });
  });

  wss.on("close", () => {
    console.log("wss close event");

    clients.forEach((ws) => {
      ws.close(1001, "Server shutting down"); // 1001 indicates going away
    });
    process.exit(0); // successful and normal termination
  });
};

export default startWs;
