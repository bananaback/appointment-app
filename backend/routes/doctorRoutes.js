import express from 'express';
import { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } from '../controllers/doctorController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET all doctors (Admin only)
router.get('/', isAuthenticated(['Admin']), getAllDoctors);

// GET single doctor by ID
router.get('/:id', isAuthenticated(['Admin', 'Doctor']), getDoctorById);

// POST create a new doctor (Admin only)
router.post('/', isAuthenticated(['Admin']), createDoctor);

// PUT update a doctor by ID (Admin only)
router.put('/:id', isAuthenticated(['Admin']), updateDoctor);

// DELETE a doctor by ID (Admin only)
router.delete('/:id', isAuthenticated(['Admin']), deleteDoctor);

export default router;
