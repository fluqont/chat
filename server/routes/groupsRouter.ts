import { Router } from "express";
import {
  groupDelete,
  groupPost,
  groupPut,
} from "../controllers/groupsController.js";
import { isGroupCreator, isUserById } from "../middlewares/isUser.js";
const router = Router();

router.post("/", isUserById, groupPost);
router.put("/:groupId", isGroupCreator, groupPut);
router.delete("/:groupId", isGroupCreator, groupDelete);

export default router;
