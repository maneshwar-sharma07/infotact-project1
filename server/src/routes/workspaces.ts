import {Router} from 'express';

import{
    createWorkspace,
    getWorkspaces,
} from '../controllers/workspace.controller';

import {verifyToken} from '../middlewares/verifyToken';

const router = Router();

router.use(verifyToken);
router.post("/",createWorkspace);
router.get("/",getWorkspaces);

export default router;
