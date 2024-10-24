import WebSocket from "ws";
import crypto from "node:crypto";
import { ExtendedWebSocket, ICreateRoomIncoming } from "../../types";
import { roomsDB } from "../db/rooms";
import { getRoomsWithOnePlayer } from "../../utils";
import { playersDB } from "../db/players";
import { updateRoomForAllClients } from "../models/roomModel";
import { updateWinnersForAllClients } from "../models/playerModel";

export const handleCreateRoom = async (
  ws: ExtendedWebSocket,
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
