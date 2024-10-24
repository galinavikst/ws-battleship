import WebSocket, { WebSocketServer } from "ws";
import crypto from "node:crypto";
import { IRegIncoming } from "../types";
import messageHandler from "./messageHandler.ts";
import { handleCreateRoom } from "./controlers/roomController.ts";
import { roomsDB } from "./db/rooms.ts";

const startWs = () => {
  const wss = new WebSocketServer({ port: 3000 });
  // After starting the program displays websocket parameters
  console.log("wss parameters =>", wss.address());
  //console.log("wss client:", wss.clients);

  wss.on("connection", function connection(ws: WebSocket, request, client) {
    ws.on("error", console.error);

    const connectionId = crypto.randomUUID();
    console.log("wss client conection id:", connectionId);

    ws.on("message", (clientMessage: string) => {
      try {
        const message = JSON.parse(clientMessage);
        // After each received command program should display the command and result
        console.log("client message:", message.type, message.data);

        if (message.type === "reg" || message.type === "add_user_to_room") {
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              messageHandler(message.type, message.data, ws, wss);
            } else {
              console.log(
                "reg, add_user_to_room types, client readyState not websocket.open"
              );
            }
          });
        } else {
          messageHandler(message.type, message.data, ws, wss);
        }
      } catch (error) {
        console.log("ws message event error parsing data", error);
      }
    });
  });

  wss.on("close", () => {
    console.log("wss close event");
  });
};

export default startWs;
