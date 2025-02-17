import { Router } from "express";
import {
  groupDelete,
  groupPost,
  groupPut,
  groupGet,
  groupProfilePicturePatch,
} from "../controllers/groupsController.js";
import { isGroupCreator, isUser, isUserById } from "../middlewares/isUser.js";
import upload from "../configs/multer.js";
const router = Router();

router.post("/", isUserById, groupPost);
// TODO: isGroupMember
router.get("/:groupId", isUser, groupGet);
router.put("/:groupId", isGroupCreator, groupPut);
router.patch(
  "/:groupId/profile-picture",
  isGroupCreator,
  upload.single("profile-picture"),
  groupProfilePicturePatch,
);
router.delete("/:groupId", isGroupCreator, groupDelete);

export default router;
