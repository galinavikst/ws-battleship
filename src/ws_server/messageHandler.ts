import WebSocket from "ws";
import { handleLogin } from "./controlers/player/login.ts";
import {
  handleAddShips,
  handleAttack,
  handleCreateRoom,
  handleRandomAttack,
} from "./controlers/room.ts";
import { handleAddPlayerToRoom } from "./controlers/room.ts";

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
      handleAddPlayerToRoom(ws, notParsedMessageData, wss);
      break;

    case "add_ships":
      handleAddShips(notParsedMessageData, wss);
      break;

    case "attack":
    case "randomAttack":
      handleAttack(notParsedMessageData, wss);
      break;

    default:
      console.log("Unknown message type:", messageType);
      break;
  }
};

export default messageHandler;
