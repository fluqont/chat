import { Router } from "express";
import {
  messageDelete,
  messagePut,
} from "../controllers/messagesController.js";
const router = Router();

router.put("/:messageId", messagePut);
router.delete("/:messageId", messageDelete);

export default router;
