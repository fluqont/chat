import { Router } from "express";
import {
  groupDelete,
  groupPost,
  groupPut,
} from "../controllers/groupsController.js";
const router = Router();

router.post("/", groupPost);
router.put("/:groupId", groupPut);
router.delete("/:groupId", groupDelete);

export default router;
