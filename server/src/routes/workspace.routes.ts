import { Router } from "express";

import {
  createWorkspace,
  getWorkspaces,
  joinWorkspaceByToken,
  generateInviteLink,
} from "../controllers/workspace.controller";

import { verifyToken } from "../middleware/verifyToken";
import { validate } from "../middleware/validate";
import { createWorkspaceValidation } from "../validators/workspace.validator";

const router = Router();

router.use(verifyToken);

// Workspace APIs
router.post(
  "/",
  createWorkspaceValidation,
  validate,
  createWorkspace
);

router.get("/", getWorkspaces);

// Invite APIs
router.post("/invite", generateInviteLink);
router.post("/join/:token", joinWorkspaceByToken);

export default router;