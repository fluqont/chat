import { Router } from "express";
import {
  groupRequestAcceptPost,
  groupRequestDelete,
  groupRequestPost,
  groupRequestsGet,
} from "../controllers/groupRequestsController.js";
import {
  isGroupCreator,
  isGroupRequestOwner,
  isUserById,
} from "../middlewares/isUser.js";
const router = Router();

router.get("/", isUserById, groupRequestsGet);
router.get("/:groupRequestId", isGroupRequestOwner, groupRequestAcceptPost);
router.post("/:groupId", isGroupCreator, groupRequestPost);
router.delete("/:groupRequestId", isGroupRequestOwner, groupRequestDelete);

export default router;
