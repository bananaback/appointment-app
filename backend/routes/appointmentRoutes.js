import express from 'express';
import {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    deleteAppointment
} from '../controllers/appointmentController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new appointment (Patient only, request an appointment with status 'Pending')
router.post('/', isAuthenticated(['Patient']), createAppointment);

// Get all appointments (Patient can see their own appointments, Doctor can see all requests for their work shifts)
router.get('/', isAuthenticated(['Admin', 'Doctor', 'Patient']), getAllAppointments);

// Get a specific appointment by ID (Admin, Doctor, or Patient)
router.get('/:id', isAuthenticated(['Admin', 'Doctor', 'Patient']), getAppointmentById);

// Update appointment status (Doctor can accept/reject/mark as done)
router.patch('/:id', isAuthenticated(['Doctor']), updateAppointmentStatus);

// Delete appointment (Patient only can delete their own appointment)
router.delete('/:id', isAuthenticated(['Patient']), deleteAppointment);

export default router;
