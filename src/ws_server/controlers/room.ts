import WebSocket from "ws";
import crypto from "node:crypto";
import {
  IClientWebSocket,
  IPlayer,
  IPosition,
  IRoom,
  IRoomUser,
  IShip,
} from "../../types";
import roomsDB from "../db/rooms";
import {
  createGame,
  updateRoomForAllClients,
  updateWinnersForAllClients,
  startGame,
  attack,
  finish,
  turn,
} from "../messageSender";
import playersDB from "../db/players";
import { getPositionsAround } from "../../utils";

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
        index: ws.playerId,
      },
    ],
  };

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
  notParsedMessageData: string,
  wss: WebSocket.Server
) => {
  try {
    const { gameId, ships, indexPlayer } = JSON.parse(notParsedMessageData);
    const extendedShips = ships.map((ship: IShip) => ({ ...ship, hits: 0 }));
    const room = (Object.values(roomsDB) as IRoom[]).find(
      (room) => room.idGame === gameId
    );
    const roomId = room?.roomId;
    const updatedRoomUsers = roomsDB[roomId as string].roomUsers.map(
      (user: IRoomUser) =>
        user.index === indexPlayer ? { ...user, ships: extendedShips } : user
    );

    roomsDB[roomId as string].roomUsers = updatedRoomUsers;

    const isAllPositionsSent = roomsDB[roomId as string].roomUsers.every(
      (user: IRoomUser) => user.ships !== undefined
    );

    if (isAllPositionsSent) {
      startGame(roomsDB[roomId as string], wss);
    }
  } catch (error) {
    console.log("error parsing data in handleAddShips", error);
  }
};

export const handleAttack = (
  notParsedMessageData: string,
  wss: WebSocket.Server
) => {
  try {
    const {
      gameId,
      x: initX,
      y: initY,
      indexPlayer,
    } = JSON.parse(notParsedMessageData);
    const room = (Object.values(roomsDB) as IRoom[]).find(
      (room) => room.idGame === gameId
    );
    const currentPlayer = room?.roomUsers.find(
      (player) => player.index === indexPlayer
    );
    const anotherPlayer = room?.roomUsers.find(
      (user) => user.index !== indexPlayer
    );
    const anotherPlayerId = playersDB[anotherPlayer?.name as string].id;
    let status: string = "miss";
    let nextPlayerIndex = anotherPlayerId; // change player if status keeps 'miss'
    let destroyedShip = {} as IShip;
    const gridSize = 10;
    const x =
      initX === undefined ? Math.floor(Math.random() * gridSize) : initX;
    const y =
      initY === undefined ? Math.floor(Math.random() * gridSize) : initY;

    const isVerticalShoted = (
      shipStartX: number,
      shipStartY: number,
      shipLength: number
    ) => {
      if (x === shipStartX && y >= shipStartY && y < shipStartY + shipLength)
        return true;
      else return false;
    };

    const isHorisontalShoted = (
      shipStartX: number,
      shipStartY: number,
      shipLength: number
    ) => {
      if (y === shipStartY && x >= shipStartX && x < shipStartX + shipLength)
        return true;
      else return false;
    };

    const isShipDestroyed = (ship: IShip) => ship.hits === ship.length;

    const updatedShips = anotherPlayer?.ships?.map((ship) => {
      const shipStartX = ship.position.x;
      const shipStartY = ship.position.y;
      const shipLength = ship.length;
      let isHit = false;

      // vertical = true
      if (ship.direction)
        isHit = isVerticalShoted(shipStartX, shipStartY, shipLength);
      else isHit = isHorisontalShoted(shipStartX, shipStartY, shipLength);

      if (isHit) {
        const updatedShip = { ...ship, hits: ship.hits + 1 };
        if (isShipDestroyed(updatedShip)) {
          status = "killed";
          destroyedShip = ship;
        } else status = "shot";
        nextPlayerIndex = indexPlayer; // keep turn for current player

        return updatedShip;
      }
      return ship;
    });

    // remove destoyed ship
    const filteredShips = updatedShips?.filter(
      (ship) => ship.hits !== ship.length
    );

    // update roomsDb
    const updatedUser = { ...anotherPlayer, ships: filteredShips };
    const updatedRoomUsers = room?.roomUsers.map((u) =>
      u.name === anotherPlayer?.name ? updatedUser : u
    );
    roomsDB[(room as IRoom).roomId].roomUsers = updatedRoomUsers;

    // check if the game finished
    if (filteredShips?.length === 0) {
      playersDB[currentPlayer?.name as string].wins += 1;
      finish(room as IRoom, wss, indexPlayer);
      updateWinnersForAllClients(wss);
    }

    const data = JSON.stringify({
      position: { x, y },
      currentPlayer: indexPlayer,
      status,
    });

    // after kill sent miss for all cells around ship too  // but keep current player
    if (status === "killed") {
      attack(wss, room as IRoom, data);

      const positionsAround: IPosition[] = getPositionsAround(destroyedShip);
      for (let position of positionsAround) {
        const data = JSON.stringify({
          position,
          currentPlayer: indexPlayer,
          status: "miss",
        });
        attack(wss, room as IRoom, data);
      }

      turn(indexPlayer, room as IRoom, wss);
    } else {
      attack(wss, room as IRoom, data);
      turn(nextPlayerIndex, room as IRoom, wss);
    }
  } catch (error) {
    console.log("error parsing data in handleAttack", error);
  }
};
