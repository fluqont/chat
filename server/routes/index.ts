import { Router } from "express";
import authRouter from "./authRouter.js";
const apiRouter = Router();

apiRouter.use("/auth", authRouter);

export default apiRouter;
