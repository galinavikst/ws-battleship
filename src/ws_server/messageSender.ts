import WebSocket from "ws";
import { getRoomsWithOnePlayer, getWinners } from "../utils";
import roomsDB from "./db/rooms";
import { IClientWebSocket, IRoom } from "../types";

export const updateRoomForAllClients = (wss: WebSocket.Server) => {
  const roomsWithOnePlayer = getRoomsWithOnePlayer();

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "update_room",
          id: 0,
          data: JSON.stringify(roomsWithOnePlayer),
        })
      );
    }
  });
};

export const updateWinnersForAllClients = (wss: WebSocket.Server) => {
  const winners = getWinners();

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "update_winners",
          id: 0,
          data: JSON.stringify(winners),
        })
      );
    }
  });
};

// send for both players in the room, after they are connected to the room
export const createGame = (indexRoom: string, wss: WebSocket.Server) => {
  const idGame = crypto.randomUUID();
  roomsDB[indexRoom].idGame = idGame;

  roomsDB[indexRoom].roomUsers.map((user: { name: string; index: string }) => {
    wss.clients.forEach((client: IClientWebSocket) => {
      if (
        client.readyState === WebSocket.OPEN &&
        client.playerName === user.name
      ) {
        client.send(
          JSON.stringify({
            type: "create_game",
            id: 0,
            data: JSON.stringify({
              idGame,
              idPlayer: client.playerId,
            }),
          })
        );
      }
    });
  });
};

// send to all players in the room
export const startGame = (room: IRoom, wss: WebSocket.Server) => {
  console.log("room", room);

  room.roomUsers.map((user) => {
    wss.clients.forEach((client: IClientWebSocket) => {
      if (
        client.readyState === WebSocket.OPEN &&
        client.playerName === user.name
      ) {
        client.send(
          JSON.stringify({
            type: "start_game",
            id: 0,
            data: JSON.stringify({
              currentPlayerIndex: user.index,
              ships: user.ships,
            }),
          })
        );

        turn(client, user.index);
      }
    });
  });
};

// after game start and every attack, miss or kill result
// send to all players in the room
const turn = (client: IClientWebSocket, currentPlayerIndex: string) => {
  client.send(
    JSON.stringify({
      type: "turn",
      id: 0,
      data: JSON.stringify({
        currentPlayerIndex,
      }),
    })
  );
};
