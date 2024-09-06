import { Router } from "express";
import {
  friendRequestDelete,
  friendRequestPost,
  friendRequestsGet,
} from "../controllers/friendRequestsController.js";
const router = Router();

router.delete("/:friendRequestId", friendRequestDelete);
router.get("/:userId", friendRequestsGet);
router.post("/:userId/requested-users/:requestedUserId", friendRequestPost);

export default router;
