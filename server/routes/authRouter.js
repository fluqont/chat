import { Router } from "express";
import { signupPost, loginPost, authGet } from "../controllers/authController";
const router = Router();

router.post("/signup", signupPost);
router.post("/login", loginPost);
router.get("/", authGet);

export default router;
