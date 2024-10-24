import WebSocket, { WebSocketServer } from "ws";

import { IRegIncoming, ICreateRoomIncoming } from "../types.ts";
import { handleLogin } from "./controlers/playerController.ts";
import { handleCreateRoom } from "./controlers/roomController.ts";

const messageHandler = (
  messageType: string,
  notParsedMessageData: string,
  ws: WebSocket,
  wss: WebSocket.Server
) => {
  switch (messageType) {
    case "reg":
      handleLogin(ws, notParsedMessageData, wss);
      break;

    case "create_room":
      handleCreateRoom(ws, wss);
      break;

    case "add_user_to_room":
      console.log("add_user_to_room", notParsedMessageData);

      break;

    case "add_ships":
      console.log("add_ships", notParsedMessageData);

      break;

    case "attack":
      console.log("attack", notParsedMessageData);

      break;

    case "randomAttack":
      console.log("randomAttack", notParsedMessageData);

      break;

    // Add other message types as needed
    default:
      console.log("Unknown message type:", messageType);
      break;
  }
};

export default messageHandler;
