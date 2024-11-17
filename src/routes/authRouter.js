import express from 'express';
import { signUp, signIn } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/refresh-token', refreshToken);

export default router;