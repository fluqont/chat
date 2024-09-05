import { Router } from "express";
import authRouter from "./authRouter.js";
import usersRouter from "./usersRouter.js";
import messagesRouter from "./messagesRouter.js";
import friendRequestsRouter from "./friendRequestsRouter.js";
const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/messages", messagesRouter);
apiRouter.use("/friendRequests", friendRequestsRouter);

export default apiRouter;
