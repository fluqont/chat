import "dotenv/config";
import express, { json, Request, urlencoded } from "express";
import cors from "cors";
import session from "express-session";
import apiRouter from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import passport, { prismaStore } from "./configs/auth.js";
import WebSocket, { WebSocketServer } from "ws";
import { parse } from "node:url";

const app = express();
app.use(cors<Request>({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: prismaStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 },
  }),
);
app.use(passport.session());

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(
  port,
  () =>
    process.env.NODE_ENV === "development" &&
    console.log("http://localhost:" + port),
);

type Ws = WebSocket & Record<string, any>;

const wss = new WebSocketServer({ port: Number(process.env.WS_PORT) || 3001 });
wss.on("connection", (ws: Ws, req) => {
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
});
