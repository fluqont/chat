import { Router } from "express";
import {
  messageDelete,
  messagePost,
  messagePut,
} from "../controllers/messagesController.js";
import { friendGet, userGet } from "../controllers/usersController.js";
const router = Router();

router.put("/:messageId", messagePut);
router.delete("/:messageId", messageDelete);
router.get("/:partnerId", userGet, friendGet);
router.post("/:partnerId", messagePost);

export default router;
