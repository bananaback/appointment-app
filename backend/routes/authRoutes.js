import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', isAuthenticated(), logout);



router.get('/admin', isAuthenticated(['Admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome, Admin!' });
});

router.get('/patient', isAuthenticated(['Admin', 'Patient']), (req, res) => {
    res.status(200).json({ message: 'Welcome, Patient!' });
});

export default router;
