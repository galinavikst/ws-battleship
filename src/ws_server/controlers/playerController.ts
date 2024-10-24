import WebSocket from "ws";
import crypto from "node:crypto";
import { ExtendedWebSocket, IRegIncoming } from "../../types.ts";
import { playersDB } from "../db/players.ts";
import { getWinners } from "../../utils.ts";
import { updateRoomForAllClients } from "../models/roomModel.ts";
import { updateWinnersForAllClients } from "../models/playerModel.ts";

export const handleLogin = (
  ws: ExtendedWebSocket,
  notParsedMessageData: string,
  wss: WebSocket.Server
) => {
  try {
    const { name, password } = JSON.parse(notParsedMessageData);
    const partial = { index: 0, name: name };

    // if the user already exists
    if (playersDB[name]) {
      if (playersDB[name].password === password) {
        ws.send(
          JSON.stringify({
            id: 0,
            type: "reg",
            data: JSON.stringify({
              ...partial,
              error: false,
              errorText: "",
            }),
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            id: 0,
            type: "reg",
            data: JSON.stringify({
              ...partial,
              error: true,
              errorText: "Incorrect password.",
            }),
          })
        );
      }
    } else {
      // Register the new user
      playersDB[name] = {
        name,
        id: crypto.randomUUID(),
        password,
        wins: 0,
      };

      ws.playerName = name; // save current connection player name
      console.log("login", name, ws.playerName);

      ws.send(
        JSON.stringify({
          id: 0,
          type: "reg",
          data: JSON.stringify({
            ...partial,
            error: false,
            errorText: "",
          }),
        })
      );
    }

    updateRoomForAllClients(wss);
    updateWinnersForAllClients(wss);
  } catch (error) {
    console.log("habdle Login parse data error", error);
  }
};
