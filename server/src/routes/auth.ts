import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
// import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.post('/register', register);
router.post('/login', login);
// router.get('/me', verifyToken, getMe); // Comment out for now

export default router;