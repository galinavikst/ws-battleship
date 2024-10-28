import WebSocket from "ws";
import crypto from "node:crypto";
import { IClientWebSocket } from "../../../types.ts";
import playersDB from "../../db/players.ts";
import {
  updateRoomForAllClients,
  updateWinnersForAllClients,
} from "../../messageSender";

export const handleLogin = (
  ws: IClientWebSocket,
  notParsedMessageData: string,
  wss: WebSocket.Server
) => {
  try {
    const { name, password } = JSON.parse(notParsedMessageData);
    const partial = { index: crypto.randomUUID(), name: name };
    const typeAndId = { id: 0, type: "reg" };

    // User data validation
    if (password.trim().length < 5 || name.trim().length < 5) {
      ws.send(
        JSON.stringify({
          ...typeAndId,
          data: JSON.stringify({
            ...partial,
            error: true,
            errorText: "Password and name should not be less then 5 symbols.",
          }),
        })
      );
      return;
    }

    // if the user already exists
    if (playersDB[name]) {
      if (playersDB[name].password === password) {
        ws.send(
          JSON.stringify({
            ...typeAndId,
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
            ...typeAndId,
            data: JSON.stringify({
              ...partial,
              error: true,
              errorText: "Incorrect password.",
            }),
          })
        );
      }
    } else {
      // Create user with password in temprorary database
      playersDB[name] = {
        name,
        id: crypto.randomUUID(),
        password,
        wins: 0,
      };

      ws.playerName = name; // save current connection player name
      ws.playerId = playersDB[name].id; // save current connection player id
      console.log("login", name, ws.playerName);

      ws.send(
        JSON.stringify({
          ...typeAndId,
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
