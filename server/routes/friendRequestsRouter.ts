import { Router } from "express";
import {
  friendRequestDelete,
  friendRequestPost,
  friendRequestsGet,
} from "../controllers/friendRequestsController.js";
import { isFriendRequestOwner, isUserById } from "../middlewares/isUser.js";
const router = Router();

router.get("/", isUserById, friendRequestsGet);
router.post("/", isUserById, friendRequestPost);
router.delete("/:friendRequestId", isFriendRequestOwner, friendRequestDelete);

export default router;
