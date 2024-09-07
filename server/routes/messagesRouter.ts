import { Router } from "express";
import {
  messageDelete,
  messagePost,
  messagePut,
  messagesGet,
} from "../controllers/messagesController.js";
const router = Router();

router.get("/", messagesGet);
router.post("/", messagePost);
router.put("/:messageId", messagePut);
router.delete("/:messageId", messageDelete);

export default router;
