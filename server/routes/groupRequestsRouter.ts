import { Router } from "express";
import {
  groupRequestDelete,
  groupRequestPost,
  groupRequestsGet,
} from "../controllers/groupRequestsController.js";
const router = Router();

router.delete("/:groupId", groupRequestDelete);
router.get("/:userId", groupRequestsGet);
router.post("/:userId", groupRequestPost);

export default router;
