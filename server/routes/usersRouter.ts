import { Router } from "express";
import {
  chatsGet,
  userByUsernameGet,
  userDelete,
  userStatusPatch,
  userUsernamePatch,
} from "../controllers/usersController.js";
import { isUserById } from "../middlewares/isUser.js";
const router = Router();

router.get("/", userByUsernameGet);
router.get("/:userId", isUserById, chatsGet);
router.patch("/:userId/status", isUserById, userStatusPatch);
router.patch("/:userId/username", isUserById, userUsernamePatch);
router.delete("/:userId", isUserById, userDelete);

// router.post("/:userId/messages/:partnerId", messagePost);
// router.get("/:userId/messages/:partnerId", userGet, friendGet);

export default router;
