import { IncomingMessage } from "http";
import { parse } from "url";
import WebSocket from "ws";
import { wss } from "../app.js";

type Ws = WebSocket & Record<string, any>;

type Message =
  | {
      type: "message" | "get-status";
    }
  | { type: "status"; data: "ONLINE" | "OFFLINE" };

export function handleConnnection(ws: Ws, req: IncomingMessage) {
  if (!req.url) return;

  try {
    const { query } = parse(req.url, true);
    ws.partnerId = query.partnerId;
    ws.userId = query.userId;

    ws.on("message", (data) => {
      const message: Message = JSON.parse(data.toString());

      switch (message.type) {
        case "message": {
          const client = getClient();
          client && client.send("message");
          break;
        }
        case "status": {
          const client = getClient(true);

          client && client.send(message.data);
          break;
        }
        case "get-status": {
          const client = getClient(true);

          ws.send(client ? "ONLINE" : "OFFLINE");
          break;
        }
      }
    });

    ws.on("close", () => {
      if (ws.userId) return;

      const client = getClient(true);
      client && client.send("OFFLINE");
    });

    function getClient(partner = false) {
      for (const client of wss.clients) {
        if (
          client !== ws &&
          client.readyState === WebSocket.OPEN &&
          (client as Ws)[partner ? "partnerId" : "userId"] === ws.partnerId
        ) {
          return client;
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
