import { Router } from "express";

import {
  createWorkspace,
  getWorkspaces,
  joinWorkspaceByToken,
  generateInviteLink,
  getWorkspaceMembers,
} from "../controllers/workspace.controller";

import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.use(verifyToken);

router.post("/", createWorkspace);
router.get("/", getWorkspaces);

router.post("/invite", generateInviteLink);
router.post("/join/:token", joinWorkspaceByToken);
router.get("/:workspaceId/members", getWorkspaceMembers);

export default router;