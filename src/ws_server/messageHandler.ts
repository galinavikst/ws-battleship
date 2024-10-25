import WebSocket from "ws";
import { handleLogin } from "./controlers/player/login.ts";
import { handleAddShips, handleCreateRoom } from "./controlers/room.ts";
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
      handleAddShips(ws, notParsedMessageData, wss);
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
