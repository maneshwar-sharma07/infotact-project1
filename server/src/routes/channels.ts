import {Router} from 'express';
import { validate } from '../middleware/validate';
import { createChannelValidation } from '../validators/channel.validator';

import {
    createChannel,
    getChannels,
} from '../controllers/channel.controller';

import {verifyToken} from '../middleware/verifyToken';

const router = Router();

router.use(verifyToken);

router.get("/",getChannels);
router.post("/",createChannelValidation, validate , createChannel);

export default router;