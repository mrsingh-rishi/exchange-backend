import { WebSocketServer } from "ws";
import { UserManager } from "./UserManager";

const wss = new WebSocketServer({ port: 3001 });

wss
  .on("connection", function connection(ws) {
    UserManager.getInstance().addUser(ws);
  })
  .on("error", function error(err) {
    console.log(err);
  });
