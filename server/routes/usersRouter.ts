import { Router } from "express";
import {
  chatsGet,
  userByUsernameGet,
  userDelete,
  userStatusPatch,
  userUsernamePatch,
} from "../controllers/usersController.js";
const router = Router();

router.get("/", userByUsernameGet);
router.get("/:userId", chatsGet);
router.patch("/:userId/status", userStatusPatch);
router.patch("/:userId/username", userUsernamePatch);
router.delete("/:userId", userDelete);

// router.post("/:userId/messages/:partnerId", messagePost);
// router.get("/:userId/messages/:partnerId", userGet, friendGet);

export default router;
