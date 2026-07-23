import { Router } from 'express';
import { createChannel, deleteChannel, getChannels } from '../controllers/channel.controller';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.use(verifyToken);

router.get('/', getChannels);
router.post('/', createChannel);
router.delete('/:id', deleteChannel);

export default router;
