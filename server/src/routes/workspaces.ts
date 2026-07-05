import {Router} from 'express';
import {validate} from '../middleware/validate';
import {createWorkspaceValidation} from '../validators/workspace.validator';

import{
    createWorkspace,
    getWorkspaces,
    joinWorkspaceByToken,
} from '../controllers/workspace.controller';

import {verifyToken} from '../middleware/verifyToken';

const router = Router();

router.use(verifyToken);
router.post("/",createWorkspaceValidation,validate,createWorkspace);
router.get("/",getWorkspaces);
router.post("/join/:token",joinWorkspaceByToken);

export default router;
