import { Router } from "express";
import {
  userByUsernameGet,
  userDelete,
  userStatusPatch,
  userUsernamePatch,
} from "../controllers/usersController.js";
const router = Router();

router.get("/", userByUsernameGet);
router.patch("/:userId/status", userStatusPatch);
router.patch("/:userId/username", userUsernamePatch);
router.delete("/:userId", userDelete);

export default router;
