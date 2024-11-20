import express from 'express';
import { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin, getDashboardStats } from '../controllers/adminController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET all admins (Admin only)
router.get('/', isAuthenticated(['Admin']), getAdmins);

router.get('/stat', isAuthenticated(['Admin']), getDashboardStats);

// GET a single admin by ID
router.get('/:id', isAuthenticated(['Admin']), getAdminById);

// POST create a new admin (Admin only)
router.post('/', isAuthenticated(['Admin']), createAdmin);

// PUT update an admin by ID (Admin only)
router.put('/:id', isAuthenticated(['Admin']), updateAdmin);

// DELETE an admin by ID (Admin only)
router.delete('/:id', isAuthenticated(['Admin']), deleteAdmin);

export default router;
