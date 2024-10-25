import WebSocket from "ws";
import crypto from "node:crypto";
import { IClientWebSocket } from "../../types";
import roomsDB from "../db/rooms";
import { updateRoomForAllClients } from "../messageSender/room";
import { updateWinnersForAllClients } from "../messageSender/player";

export const handleCreateRoom = (
  ws: IClientWebSocket,
  wss: WebSocket.Server
) => {
  // add new room to db and add user there
  const id = crypto.randomUUID();
  roomsDB[id] = {
    roomId: id,
    roomUsers: [
      {
        name: ws.playerName,
        index: 0,
      },
    ],
  };

  console.log("Current roomsDB:", roomsDB);

  updateRoomForAllClients(wss);
  updateWinnersForAllClients(wss);
};
