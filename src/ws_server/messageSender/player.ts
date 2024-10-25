import WebSocket from "ws";
import { getWinners } from "../../utils";

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
