import WebSocket from "ws";
import { getRoomsWithOnePlayer } from "../../utils";

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
