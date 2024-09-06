import { Router } from "express";
import {
  groupDelete,
  groupGet,
  groupPost,
  groupPut,
} from "../controllers/groupsController.js";
const router = Router();

router.post("/", groupPost);
router.get("/:groupId", groupGet);
router.put("/:groupId", groupPut);
router.delete("/:groupId", groupDelete);

export default router;
