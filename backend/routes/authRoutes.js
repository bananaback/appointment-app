import express from 'express';
import { register, login, logout, getUserInfo } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', isAuthenticated(), logout);


router.get('/users/:id', isAuthenticated(['Admin', 'Doctor', 'Patient']), getUserInfo);


export default router;
