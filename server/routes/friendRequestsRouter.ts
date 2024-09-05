import { Router } from "express";
import {
  friendRequestDelete,
  friendRequestPost,
  friendRequestsGet,
} from "../controllers/friendRequestsController.js";
const router = Router();

router.get("/:userId/requestedUsers", friendRequestsGet);
router.post("/:userId/requestedUsers/:requestedUserId", friendRequestPost);
router.delete("/:friendRequestId", friendRequestDelete);

export default router;
