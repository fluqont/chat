import { Router } from "express";
import {
  messageDelete,
  messagePost,
  messagePut,
} from "../controllers/messagesController.js";
import { friendGet, userGet } from "../controllers/usersController.js";
const router = Router();

router.post("/:partnerId", messagePost);
router.put("/:messageId", messagePut);
router.delete("/:messageId", messageDelete);
router.get("/:partnerId", userGet, friendGet);

export default router;
