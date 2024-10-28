import WebSocket from "ws";

export interface IClientWebSocket extends WebSocket {
  playerName?: string;
  playerId?: string;
}

interface IRegIncomingData {
  name: string;
  password: string;
}

interface IRegOutcomingData {
  name: string;
  index: number | string;
  error: boolean;
  errorText: string;
}

export interface IRegIncoming {
  id: number;
  type: string;
  data: IRegIncomingData;
}
export interface ICreateRoomIncoming {
  id: number;
  type: string;
  data: string;
}

export interface IRegOucoming {
  type: string;
  data: IRegOutcomingData;
  id: number;
}

export interface IPosition {
  x: number;
  y: number;
}
export interface IShip {
  position: IPosition;
  direction: boolean;
  length: number;
  hits: number;
  type: string; // "small"|"medium"|"large"|"huge",
}

export interface IRoomUser {
  name: string;
  index: string;
  ships?: IShip[];
}
export interface IRoom {
  roomId: number | string;
  idGame?: string;
  roomUsers: IRoomUser[];
}

export interface IPlayer {
  name: string;
  id: string;
  password: string;
  wins: number;
}
