import { Router } from "express";
import {
  groupDelete,
  groupPost,
  groupPut,
  groupGet,
} from "../controllers/groupsController.js";
import { isGroupCreator, isUser, isUserById } from "../middlewares/isUser.js";
const router = Router();

router.post("/", isUserById, groupPost);
// TODO: isGroupMember
router.get("/:groupId", isUser, groupGet);
router.put("/:groupId", isGroupCreator, groupPut);
router.delete("/:groupId", isGroupCreator, groupDelete);

export default router;
