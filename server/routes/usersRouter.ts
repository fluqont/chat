import { Router } from "express";
import {
  userDelete,
  userGet,
  userStatusPatch,
  userUsernamePatch,
} from "../controllers/usersController.js";
import { messagePost, messagesGet } from "../controllers/messagesController.js";
const router = Router();

router.get("/", userGet);
router.patch("/:userId/status", userStatusPatch);
router.patch("/:userId/username", userUsernamePatch);
router.delete("/:userId", userDelete);

router.get("/:userId/messages/:partnerId", messagesGet);
router.route("/:userId/messages/:partnerId").get(messagesGet).post(messagePost);

export default router;
