import { Router } from "express";
import { authGet, signupPost } from "../controllers/authController.js";
import passport from "passport";
import { ErrorWithStatus } from "../middlewares/errorHandler.js";
const router = Router();

router.post("/signup", signupPost);
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: true },
    (err: any, user: Express.User) => {
      if (err) {
        return next(new ErrorWithStatus("Invalid credentials", 400));
      }

      req.login(user, async () => {
        res.json({ user: user });
      });
    },
  )(req, res, next);
});
router.get("/", authGet);

export default router;
