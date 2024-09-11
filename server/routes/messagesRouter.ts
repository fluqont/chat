import { Router } from "express";
import {
  messageDelete,
  messagePost,
  messagePut,
  messagesGet,
} from "../controllers/messagesController.js";
import {
  isMessageOwner,
  isSender,
  isUserByIdOrInGroup,
} from "../middlewares/isUser.js";
const router = Router();

router.get("/", isUserByIdOrInGroup, messagesGet);
router.post("/", isSender, messagePost);
router.put("/:messageId", isMessageOwner, messagePut);
router.delete("/:messageId", isMessageOwner, messageDelete);

export default router;
