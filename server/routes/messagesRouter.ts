import { Router } from "express";
import {
  attachmentsPost,
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
import upload from "../configs/multer.js";
const router = Router();

router.get("/", isUserByIdOrInGroup, messagesGet);
router.post("/", isSender, messagePost);
router.post(
  "/:messageId/attachments",
  isMessageOwner,
  upload.any(),
  attachmentsPost,
);
router.put("/:messageId", isMessageOwner, messagePut);
router.delete("/:messageId", isMessageOwner, messageDelete);

export default router;
