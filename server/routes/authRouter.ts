import { Router } from "express";
import { authGet, signupPost } from "../controllers/authController.js";
import passport from "passport";
const router = Router();

router.post("/signup", signupPost);
router.post(
  "/login",
  passport.authenticate("local", {
    session: true,
    failureRedirect: "/api/auth",
  }),
  authGet,
);
router.get("/", authGet);

export default router;
