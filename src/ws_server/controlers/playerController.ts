import WebSocket from "ws";
import { IRegIncoming } from "../../types.ts";
import { playersDB } from "../db/players.ts";

export const handleLogin = (ws: WebSocket, message: IRegIncoming) => {
  const { data, type, id } = message;
  const partial = { index: 0, name: data.name };

  // if the user already exists
  if (playersDB[data.name]) {
    if (playersDB[data.name].password === data.password) {
      ws.send(
        JSON.stringify({
          ...message,
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
          ...message,
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
    playersDB[data.name] = {
      name: data.name,
      id: 0,
      password: data.password,
      wins: 0,
    };
    ws.send(
      JSON.stringify({
        ...message,
        data: JSON.stringify({
          ...partial,
          error: false,
          errorText: "",
        }),
      })
    );
  }
};
