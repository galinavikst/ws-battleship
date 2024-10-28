import { httpServer } from "./src/http_server/index.ts";
import startWs from "./src/ws_server/ws_server.ts";

const HTTP_PORT = 8181;

startWs();
console.log(`Start static http server on the ${HTTP_PORT} port!`);

httpServer.listen(HTTP_PORT);
