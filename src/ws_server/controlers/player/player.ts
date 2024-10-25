import WebSocket from "ws";
import roomsDB from "../../db/rooms";
import { IClientWebSocket } from "../../../types";
import { updateRoomForAllClients } from "../../messageSender/room";
import { createGame } from "../../messageSender/game";

export const handleAddPlayerToRoom = (
  ws: IClientWebSocket,
  notParsedMessageData: string,
  wss: WebSocket.Server
) => {
  try {
    const indexRoom = JSON.parse(notParsedMessageData).indexRoom;
    roomsDB[indexRoom].roomUsers.push({ name: ws.playerName, index: 0 });
    updateRoomForAllClients(wss);
    createGame(indexRoom, wss); // send for both players in the room, after they are connected to the room
  } catch (error) {
    console.log("error parsing data in handleAddPlayerToRoom", error);
  }
};
