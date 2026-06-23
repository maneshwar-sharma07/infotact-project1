import {Router} from 'express';
import {
    createMessage,
    getMessages,
} from '../controllers/message.controller';

import {verifyToken} from '../middleware/verifyToken';

const router = Router();

router.use(verifyToken);

router.get("/",getMessages);
router.post("/",createMessage);

export default router;