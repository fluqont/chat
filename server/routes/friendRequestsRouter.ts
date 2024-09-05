import { Router } from "express";
import {
  friendRequestDelete,
  friendRequestPost,
  friendRequestsGet,
} from "../controllers/friendRequestsController.js";
const router = Router();

router.delete("/:friendRequestId", friendRequestDelete);
router.get("/:userId/requestedUsers", friendRequestsGet);
router.post("/:userId/requestedUsers/:requestedUserId", friendRequestPost);

export default router;
