import express from 'express';
import { register, login, logout, getUserInfo, getProfile, updateProfile } from '../controllers/authController.js';

import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', isAuthenticated(), logout);


router.get('/users/:id', isAuthenticated(['Admin', 'Doctor', 'Patient']), getUserInfo);
router.get('/profile', isAuthenticated(), getProfile);
router.put("/profile", isAuthenticated(), updateProfile);

export default router;
