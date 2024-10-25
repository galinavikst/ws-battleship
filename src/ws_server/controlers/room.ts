import WebSocket from "ws";
import crypto from "node:crypto";
import { IClientWebSocket } from "../../types";
import roomsDB from "../db/rooms";
import {
  createGame,
  updateRoomForAllClients,
  updateWinnersForAllClients,
  startGame,
} from "../messageSender";

export const handleCreateRoom = (
  ws: IClientWebSocket,
  wss: WebSocket.Server
) => {
  // add new room to db and add user there
  // Player room data (players, game board, ships positions) storages in the server
  const id = crypto.randomUUID();
  roomsDB[id] = {
    roomId: id,
    roomUsers: [
      {
        name: ws.playerName,
        index: ws.playerId,
      },
    ],
  };
  console.log("Current roomsDB:", roomsDB);

  updateRoomForAllClients(wss);
  updateWinnersForAllClients(wss);
};

export const handleAddPlayerToRoom = (
  ws: IClientWebSocket,
  notParsedMessageData: string,
  wss: WebSocket.Server
) => {
  try {
    const indexRoom = JSON.parse(notParsedMessageData).indexRoom;
    roomsDB[indexRoom].roomUsers.push({
      name: ws.playerName,
      index: ws.playerId,
    });

    updateRoomForAllClients(wss);
    createGame(indexRoom, wss); // send for both players in the room, after they are connected to the room
  } catch (error) {
    console.log("error parsing data in handleAddPlayerToRoom", error);
  }
};

export const handleAddShips = (
  ws: IClientWebSocket,
  notParsedMessageData: string,
  wss: WebSocket.Server
) => {
  try {
    const { gameId, ships, indexPlayer } = JSON.parse(notParsedMessageData);

    const roomId = Object.keys(roomsDB).find(
      (key) => roomsDB[key].idGame === gameId
    );
    console.log("roomid", roomId);

    const updatedRoomUsers = roomsDB[roomId as string].roomUsers.map((user) =>
      user.index === indexPlayer ? { ...user, ships } : user
    );
    console.log("updatedRoomUsers", updatedRoomUsers);

    roomsDB[roomId as string].roomUsers = updatedRoomUsers;

    console.log("roomsDB", roomsDB);

    const isAllPositionsSent = roomsDB[roomId as string].roomUsers.every(
      (user) => user.ships.length > 0
    );

    if (isAllPositionsSent) {
      console.log("ready");
      startGame(roomsDB[roomId as string], wss);
    }
  } catch (error) {
    console.log("error parsing data in handleAddShips", error);
  }
};
// {
//   type: "add_ships",
//   data:
//       {
//           gameId: <number | string>,
//           ships:
//               [
//                   {
//                       position: {
//                           x: <number>,
//                           y: <number>,
//                       },
//                       direction: <boolean>,
//                       length: <number>,
//                       type: "small"|"medium"|"large"|"huge",
//                   }
//               ],
//           indexPlayer: <number | string>, /* id of the player in the current game session */
//       },
//   id: 0,
// }
