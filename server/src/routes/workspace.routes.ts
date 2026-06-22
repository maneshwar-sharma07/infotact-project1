import {Router} from 'express';

import{
    createWorkspace,
    getWorkspaces,
    joinWorkspaceByToken,
} from '../controllers/workspace.controller';

import {verifyToken} from '../middlewares/verifyToken';

const router = Router();

router.use(verifyToken);
router.post("/",createWorkspace);
router.get("/",getWorkspaces);
router.post("/join/:token",joinWorkspaceByToken);

export default router;
