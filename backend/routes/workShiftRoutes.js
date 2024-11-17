import express from 'express';
import {
    createWorkShift,
    getAllWorkShifts,
    getWorkShiftById,
    updateWorkShift,
    deleteWorkShift
} from '../controllers/workShiftController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new work shift (Admin only)
router.post('/', isAuthenticated(['Admin']), createWorkShift);

// Get all work shifts with optional filters (Admin, Doctor, or Patient)
router.get('/', isAuthenticated(['Admin', 'Doctor', 'Patient']), getAllWorkShifts);

// Get a specific work shift by ID (Admin, Doctor, or Patient)
router.get('/:id', isAuthenticated(['Admin', 'Doctor', 'Patient']), getWorkShiftById);

// Update a work shift by ID (Admin only)
router.put('/:id', isAuthenticated(['Admin']), updateWorkShift);

// Delete a work shift by ID (Admin only)
router.delete('/:id', isAuthenticated(['Admin']), deleteWorkShift);

export default router;
