import { Router } from "express";
import {
  friendGet,
  userByUsernameGet,
  userDelete,
  userGet,
  userStatusPatch,
  userUsernamePatch,
} from "../controllers/usersController.js";
import { messagePost } from "../controllers/messagesController.js";
const router = Router();

router.get("/", userByUsernameGet);
router.patch("/:userId/status", userStatusPatch);
router.patch("/:userId/username", userUsernamePatch);
router.delete("/:userId", userDelete);

router.post("/:userId/messages/:partnerId", messagePost);
router.get("/:userId/messages/:partnerId", userGet, friendGet);

export default router;
