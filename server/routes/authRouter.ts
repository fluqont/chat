import { Router } from "express";
import {
  authGet,
  logoutGet,
  signupPost,
} from "../controllers/authController.js";
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
router.get("/logout", logoutGet);
router.get("/", authGet);

export default router;
