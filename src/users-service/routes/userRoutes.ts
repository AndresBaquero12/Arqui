import { Router } from 'express';
import { registerUser, getUserByEmail, getUserById } from '../controllers/userController';

const router = Router();

// Public route
router.post('/register', registerUser);

// Internal routes (in a real app, these should be protected from public access)
router.get('/internal/users/email/:email', getUserByEmail);
router.get('/internal/users/:id', getUserById);

export default router;
