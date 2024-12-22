import "dotenv/config";
import express, { json, Request, urlencoded } from "express";
import cors from "cors";
import session from "express-session";
import apiRouter from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import passport, { prismaStore } from "./configs/auth.js";
import { Server } from "socket.io";
import { updateStatus } from "./services/usersService.js";
import { createServer } from "http";

const app = express();
const http = createServer(app);
app.use(cors<Request>({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: prismaStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2,
    },
  }),
);
app.use(passport.session());

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT ?? 3000;
http.listen(
  port,
  () =>
    process.env.NODE_ENV === "development" &&
    console.log("http://localhost:" + port),
);

export const io = new Server(http, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});
io.on("connection", async (socket) => {
  io.to(`/users/${socket.handshake.auth.token}`).emit("status", "ONLINE");
  await updateStatus(socket.handshake.auth.token, "ONLINE");

  socket.on("disconnect", async () => {
    io.to(`/users/${socket.handshake.auth.token}`).emit("status", "OFFLINE");
    await updateStatus(socket.handshake.auth.token, "OFFLINE");
  });

  socket.on("/users", async (senderId) => {
    await socket.join(`/users/${senderId}`);
  });
  socket.on("/groups", async (groupId) => {
    await socket.join(`/groups/${groupId}`);
  });
});
