import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { registerValidaton, loginValidation } from '../validators/auth.validator';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register', registerValidaton, validate, register);
router.post('/login', loginValidation, validate, login);

export default router;
