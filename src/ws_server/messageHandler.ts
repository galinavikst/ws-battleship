import WebSocket, { WebSocketServer } from "ws";

import { IRegIncoming } from "../types.ts";
import { handleLogin } from "./controlers/playerController.ts";

const messageHandler = (message: IRegIncoming, ws: WebSocket) => {
  switch (message.type) {
    case "reg":
      handleLogin(ws, message);
      break;

    // Add other message types as needed
    default:
      console.log("Unknown message type:", message.type);
      break;
  }
};

export default messageHandler;
