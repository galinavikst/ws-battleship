import WebSocket, { WebSocketServer } from "ws";
import { IRegIncoming } from "../types";
import messageHandler from "./messageHandler.ts";

const startWs = () => {
  const wss = new WebSocketServer({ port: 3000 });
  // After starting the program displays websocket parameters
  console.log("wss parameters =>", wss.address());

  wss.on("connection", function connection(ws: WebSocket, request, client) {
    ws.on("error", console.error);

    ws.on("message", (clientMessage: string) => {
      try {
        const message = JSON.parse(clientMessage);
        messageHandler(message, ws);
      } catch (error) {
        console.log("ws message event error parsing data", error);
      }
    });
  });

  wss.on("close", () => {
    console.log("wss close event");
  });

  console.log("WebSocket Server is running on ws://localhost:3000");
};

export default startWs;
