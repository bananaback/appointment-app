import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);  // User registration
router.post('/login', login);        // User login

// Protected route (requires authentication)
router.post('/logout', isAuthenticated(), logout);  // User logout (only if authenticated)

// Protected route that only allows access to Admins
router.get('/admin', isAuthenticated(['Admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome, Admin!' });
});

// Protected route that only allows access to Admins, patients
router.get('/patient', isAuthenticated(['Admin', 'Patient']), (req, res) => {
    res.status(200).json({ message: 'Welcome, Patient!' });
});

export default router;
