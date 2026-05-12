import { Router } from 'express';
import { loginUser, generateQr, googleCallback } from '../controllers/authController';

const router = Router();

router.post('/login', loginUser);
router.get('/auth/qr/generate', generateQr);
router.get('/auth/google/callback', googleCallback);

export default router;
