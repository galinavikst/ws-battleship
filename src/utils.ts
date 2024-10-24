import { IPlayer, IRoom } from "./types";
import { playersDB } from "./ws_server/db/players";
import { roomsDB } from "./ws_server/db/rooms";

export const getRoomsWithOnePlayer = () =>
  Object.keys(roomsDB).reduce<IRoom[]>((acc, key) => {
    if (roomsDB[key].roomUsers.length === 1) {
      acc.push(roomsDB[key]);
    }
    return acc;
  }, []);

export const getWinners = () =>
  Object.keys(playersDB).reduce<{ name: string; wins: number }[]>(
    (acc, key) => {
      if (playersDB[key].wins > 0)
        acc.push({ name: playersDB[key].name, wins: playersDB[key].wins });
      return acc;
    },
    []
  );
