import { Router } from "express";

import {
  createWorkspace,
  getWorkspaces,
  joinWorkspaceByToken,
  generateInviteLink,
} from "../controllers/workspace.controller";

import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

// Workspace APIs
router.post("/", createWorkspace);
router.get("/", getWorkspaces);

// Invite APIs
router.post("/invite", generateInviteLink);
router.post("/join/:token", joinWorkspaceByToken);

export default router;