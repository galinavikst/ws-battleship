import WebSocket from "ws";

export interface ExtendedWebSocket extends WebSocket {
  playerName?: string;
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

export interface IRoom {
  roomId: number | string;
  roomUsers: [
    {
      name: string;
      index: number | string;
    }
  ];
}

export interface IPlayer {
  name: string;
  id: string;
  password: string;
  wins: number;
}
