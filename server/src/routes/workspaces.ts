import { Router } from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  generateInviteLink,
  getInviteWorkspace,
  joinWorkspaceByInviteToken,
  getWorkspaceMembers,
  addMember,
  leaveWorkspace,
  removeMember,
} from '../controllers/workspace.controller';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.use(verifyToken);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.post('/invite', generateInviteLink);
router.get('/join/:token', getInviteWorkspace);
router.post('/join/:token', joinWorkspaceByInviteToken);
router.get('/:id', getWorkspaceById);
router.get('/:id/members', getWorkspaceMembers);
router.patch('/:id', updateWorkspace);
router.delete('/:id', deleteWorkspace);
router.post('/:id/leave', leaveWorkspace);
router.post('/:id/members', addMember);
router.delete('/:workspaceId/member/:memberId', removeMember);

export default router;
