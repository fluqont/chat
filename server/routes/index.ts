import { Router } from "express";
import authRouter from "./authRouter.js";
import usersRouter from "./authRouter.js";
const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);

export default apiRouter;
