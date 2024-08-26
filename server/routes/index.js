import { Router } from "express";
import authRouter from "./authRouter";
const router = Router();

router.get("/auth", authRouter);

export default router;
