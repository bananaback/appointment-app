import Appointment from '../models/Appointment.js';
import WorkShift from '../models/WorkShift.js';
import UserAccount from '../models/UserAccount.js';

// Create an appointment request
export const createAppointment = async (req, res) => {
    try {
        const { workShiftId, notes } = req.body;
        const patientId = req.user.id;  // Assuming the patient is authenticated

        // Check if the work shift exists and is available
        const workShift = await WorkShift.findById(workShiftId);
        if (!workShift) {
            return res.status(404).json({ message: 'Work shift not found' });
        }

        if (workShift.isReserved) {
            return res.status(400).json({ message: 'Work shift is already reserved' });
        }

        // Create the appointment
        const appointment = new Appointment({
            workShift: workShiftId,
            patient: patientId,
            notes: notes,
        });

        // Save the appointment
        await appointment.save();

        // Update the work shift to mark it as reserved
        workShift.isReserved = true;
        workShift.appointment = appointment._id;
        await workShift.save();

        res.status(201).json({
            message: 'Appointment created successfully',
            appointment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const { date } = req.query;  // Optional date filter
        const userId = req.user.id;  // The currently authenticated user's ID

        // Get the user's role from the database to verify
        const user = await UserAccount.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userRole = user.role;  // The role of the current user (Patient/Doctor)

        let filter = {};

        if (userRole === 'Patient') {
            // Patient should see their own appointments
            filter.patient = userId;

            if (date) {
                // If date filter is provided, filter appointments by date
                const startOfDay = new Date(date);
                const endOfDay = new Date(startOfDay);
                endOfDay.setHours(23, 59, 59, 999);
                filter.requestDate = { $gte: startOfDay, $lte: endOfDay };
            }

        } else if (userRole === 'Doctor') {
            // Doctor should see appointments where they are the assigned doctor
            const workShifts = await WorkShift.find({ doctor: userId });

            if (!workShifts.length) {
                return res.status(404).json({ message: 'No work shifts found for this doctor.' });
            }

            filter.workShift = { $in: workShifts.map(ws => ws._id) };

            if (date) {
                // If date filter is provided, filter appointments by date
                const startOfDay = new Date(date);
                const endOfDay = new Date(startOfDay);
                endOfDay.setHours(23, 59, 59, 999);
                filter.requestDate = { $gte: startOfDay, $lte: endOfDay };
            }
        }

        // Fetch appointments based on the filter
        const appointments = await Appointment.find(filter)
            .populate('patient', 'firstName lastName email phone')  // Patient details
            .populate('workShift', 'date timeSlot')  // Work shift details
            .sort({ requestDate: -1 });  // Sort by request date (latest first)

        res.status(200).json({ appointments });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        // Extract appointment ID and user ID from request
        const appointmentId = req.params.id;  // Appointment ID from the route
        const userId = req.user.id;  // The currently authenticated user's ID
        const { status } = req.body;  // New status (Accepted, Rejected, or Done)

        // Step 1: Validate the provided status
        if (!['Accepted', 'Rejected', 'Done'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Valid options are: Accepted, Rejected, Done.' });
        }

        // Step 2: Fetch the appointment from the database and populate workShift to access the doctor
        const appointment = await Appointment.findById(appointmentId).populate('workShift');
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Step 3: Check if the authenticated user is a doctor
        const user = await UserAccount.findById(userId);
        if (!user || user.role !== 'Doctor') {
            return res.status(403).json({ message: 'Only doctors can update appointment status' });
        }

        // Step 4: Ensure the doctor is assigned to the work shift for this appointment
        if (appointment.workShift.doctor.toString() !== userId) {
            return res.status(403).json({ message: 'You can only update appointments for your own work shifts' });
        }

        // Step 5: Validate the status transition based on the current appointment status
        if (appointment.status === 'Pending' && status === 'Accepted') {
            // Pending -> Accepted: Valid transition (Doctor accepts the appointment)
        } else if (appointment.status === 'Pending' && status === 'Rejected') {
            // Pending -> Rejected: Valid transition (Doctor rejects the appointment)
        } else if (appointment.status === 'Accepted' && status === 'Done') {
            // Accepted -> Done: Valid transition (Doctor marks the appointment as done)
        } else {
            return res.status(400).json({ message: 'Invalid status transition' });
        }

        // Step 6: Update the appointment status
        appointment.status = status;

        // If status is 'Done', mark the associated work shift as Reserved (isReserved = true)
        if (status === 'Done') {
            const workShift = appointment.workShift;
            workShift.isReserved = true;  // Set isReserved to true
            await workShift.save();  // Save the updated work shift
        }

        // Save the updated appointment
        await appointment.save();

        // Step 7: Respond with the updated status
        res.status(200).json({ message: `Appointment status updated to ${status}` });

    } catch (error) {
        // Log the error and send a 500 server error response
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get an appointment by its ID
export const getAppointmentById = async (req, res) => {
    try {
        const appointmentId = req.params.id;  // Appointment ID from the route
        const userId = req.user.id;  // The currently authenticated user's ID

        // Fetch the appointment from the database and populate related fields
        const appointment = await Appointment.findById(appointmentId)
            .populate('patient', 'firstName lastName email phone')  // Patient details
            .populate('workShift', 'date timeSlot')  // Work shift details
            .populate('doctor', 'firstName lastName email phone')  // Doctor details (if needed)
            .exec();

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check if the logged-in user is the patient or the doctor
        const user = await UserAccount.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only the patient or the assigned doctor should be able to view the appointment
        if (appointment.patient.toString() !== userId && appointment.workShift.doctor.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to view this appointment' });
        }

        res.status(200).json({ appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete an appointment (patient only)
export const deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.id;  // Appointment ID from the route
        const patientId = req.user.id;  // The currently authenticated user's ID

        // Fetch the appointment from the database
        const appointment = await Appointment.findById(appointmentId).populate('workShift');
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Ensure the logged-in user is the patient who created the appointment
        if (appointment.patient.toString() !== patientId) {
            return res.status(403).json({ message: 'You can only delete your own appointment' });
        }

        // Ensure the appointment status is still 'Pending' before allowing deletion
        if (appointment.status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending appointments can be deleted' });
        }

        // Delete the appointment
        await appointment.remove();

        // Update the work shift to mark it as available (isReserved = false)
        const workShift = appointment.workShift;
        workShift.isReserved = false;  // Mark work shift as available
        workShift.appointment = null;  // Remove the appointment reference
        await workShift.save();

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
