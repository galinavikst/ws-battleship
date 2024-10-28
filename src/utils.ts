import { IPosition, IRoom, IShip } from "./types";
import playersDB from "./ws_server/db/players";
import roomsDB from "./ws_server/db/rooms";

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

export const getPositionsAround = (destroyedShip: IShip): IPosition[] => {
  const { position, direction, length } = destroyedShip;
  const surroundingPositions: IPosition[] = [];
  const gridSize = 10;

  if (direction) {
    // Vertical

    // not sticked to top border
    if (position.y > 0) {
      surroundingPositions.push({ x: position.x, y: position.y - 1 }); // top
      surroundingPositions.push({ x: position.x + 1, y: position.y - 1 }); // top-right corner
      surroundingPositions.push({ x: position.x - 1, y: position.y - 1 }); // top-left corner
    }

    // not sticked to buttom border -  set bottom
    if (position.y + length < gridSize) {
      surroundingPositions.push({ x: position.x, y: position.y + length }); // bottom
      surroundingPositions.push({
        x: position.x + 1,
        y: position.y + length,
      }); // buttom-right corner
      surroundingPositions.push({
        x: position.x - 1,
        y: position.y + length,
      }); // set buttom-left corner
    }

    // add others left and right
    for (let i = 0; i < length; i++) {
      const y = position.y + i;
      if (position.x > 0) surroundingPositions.push({ x: position.x - 1, y });
      if (position.x + 1 < gridSize)
        surroundingPositions.push({ x: position.x + 1, y });
    }
  } else {
    // Horizontal

    // not sticked to left border
    if (position.x > 0) {
      surroundingPositions.push({ x: position.x - 1, y: position.y }); // left
      surroundingPositions.push({ x: position.x - 1, y: position.y - 1 }); // left-top corner
      surroundingPositions.push({ x: position.x - 1, y: position.y + 1 }); // left-right corner
    }

    // not sticked to right border
    if (position.x + length < gridSize) {
      surroundingPositions.push({ x: position.x + length, y: position.y }); // right
      surroundingPositions.push({ x: position.x + length, y: position.y - 1 }); // right-top corner
      surroundingPositions.push({ x: position.x + length, y: position.y + 1 }); // right-bottom corner
    }

    // add others top and bottom
    for (let i = 0; i < length; i++) {
      const x = position.x + i;
      if (position.y > 0) surroundingPositions.push({ x, y: position.y - 1 });
      if (position.y + 1 < gridSize)
        surroundingPositions.push({ x, y: position.y + 1 });
    }
  }

  return surroundingPositions;
};
