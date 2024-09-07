import { Router } from "express";
import {
  groupRequestDelete,
  groupRequestPost,
  groupRequestsGet,
} from "../controllers/groupRequestsController.js";
const router = Router();

router.get("/", groupRequestsGet);
router.post("/", groupRequestPost);
router.delete("/:groupRequestId", groupRequestDelete);

export default router;
