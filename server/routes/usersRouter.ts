import { Router } from "express";
import {
  chatsGet,
  friendsGet,
  userByUsernameGet,
  userDelete,
  userUsernamePatch,
} from "../controllers/usersController.js";
import { isUserById } from "../middlewares/isUser.js";
const router = Router();

router.get("/", userByUsernameGet);
router.get("/:userId/chats", isUserById, chatsGet);
router.get("/:userId/friends", isUserById, friendsGet);
router.patch("/:userId/username", isUserById, userUsernamePatch);
router.delete("/:userId", isUserById, userDelete);

export default router;
