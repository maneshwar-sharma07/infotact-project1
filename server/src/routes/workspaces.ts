import { Router } from "express";

import {
  createWorkspace,
  getWorkspaces,
  joinWorkspaceByToken,
  generateInviteLink,
  getWorkspaceMembers,
} from "../controllers/workspace.controller";

import { verifyToken } from "../middleware/verifyToken";
import { validate } from "../middleware/validate";
import { createWorkspaceValidation } from "../validators/workspace.validator";

const router = Router();

router.use(verifyToken);

// Workspace
router.post(
  "/",
  createWorkspaceValidation,
  validate,
  createWorkspace
);

router.get("/", getWorkspaces);

// Invite
router.post("/invite", generateInviteLink);
router.post("/join/:token", joinWorkspaceByToken);

// Members
router.get("/:workspaceId/members", getWorkspaceMembers);

export default router;