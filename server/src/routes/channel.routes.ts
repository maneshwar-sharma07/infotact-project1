import {Router} from 'express';

import {
    createChannel,
    getChannels,
} from '../controllers/channel.controller';

import {verifyToken} from '../middlewares/verifyToken';

const router = Router();

router.use(verifyToken);

router.get("/",getChannels);
router.post("/",createChannel);

export default router;