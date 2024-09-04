import { Router } from "express";
import {
  userDelete,
  userGet,
  userStatusPatch,
  userUsernamePatch,
} from "../controllers/usersController.js";
const router = Router();

router.get("/", userGet);
router.patch("/:userId/status", userStatusPatch);
router.patch("/:userId/username", userUsernamePatch);
router.delete("/:userId", userDelete);

export default router;
