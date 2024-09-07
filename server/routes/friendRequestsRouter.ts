import { Router } from "express";
import {
  friendRequestDelete,
  friendRequestPost,
  friendRequestsGet,
} from "../controllers/friendRequestsController.js";
const router = Router();

router.get("/", friendRequestsGet);
router.post("/", friendRequestPost);
router.delete("/:friendRequestId", friendRequestDelete);

export default router;
