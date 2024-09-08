import { IncomingMessage } from "http";
import { parse } from "url";
import WebSocket from "ws";
import { wss } from "../app.js";

type Ws = WebSocket & Record<string, any>;

export function handleConnnection(ws: Ws, req: IncomingMessage) {
  if (!req.url) return;

  try {
    const { query } = parse(req.url, true);
    ws.partnerId = query.partnerId;
    ws.userId = query.userId;

    ws.on("message", (data) => {
      const message: { type: "message" } = JSON.parse(data.toString());

      const client = getClient();

      switch (message.type) {
        case "message": {
          client && client.send("message");
          break;
        }
      }
    });

    function getClient() {
      for (const client of wss.clients) {
        if (
          client !== ws &&
          client.readyState === WebSocket.OPEN &&
          (client as Ws).userId === ws.partnerId
        ) {
          return client;
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}
