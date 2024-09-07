import { Router } from "express";
import {
  messageDelete,
  messagePost,
  messagePut,
  messagesGet,
} from "../controllers/messagesController.js";
import { isMessageOwner, isUserById } from "../middlewares/isUser.js";
const router = Router();

router.get("/", isUserById, messagesGet);
router.post("/", isUserById, messagePost);
router.put("/:messageId", isMessageOwner, messagePut);
router.delete("/:messageId", isMessageOwner, messageDelete);

export default router;
