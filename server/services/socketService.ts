import { updateStatus } from "./usersService.js";
import { io } from "../app.js";

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
