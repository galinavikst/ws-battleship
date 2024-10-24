import * as fs from "fs";
import * as path from "path";
import * as http from "http";

export const httpServer = http.createServer(function (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  }
) {
  const __dirname = path.resolve(path.dirname(""));
  const file_path =
    __dirname + (req.url === "/" ? "/front/index.html" : "/front" + req.url);
  console.log(file_path);

  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

// httpServer.on("message", (chunk) => {
//   console.log(chunk);
// });

// httpServer.on("close", () => {
//   console.log("http close event");
// });
