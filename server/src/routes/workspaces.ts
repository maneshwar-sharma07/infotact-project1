import { Router } from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
} from '../controllers/workspace.controller';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.use(verifyToken);

router.get('/', getWorkspaces);
router.post('/', createWorkspace);
router.get('/:id', getWorkspaceById);
router.patch('/:id', updateWorkspace);
router.delete('/:id', deleteWorkspace);
router.post('/:id/members', addMember);

export default router;