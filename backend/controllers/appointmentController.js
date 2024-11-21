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
        const { startDate, endDate } = req.query; // Bộ lọc khoảng thời gian tùy chọn
        const user = req.user; // Thông tin user từ middleware isAuthenticated

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { id: userId, role: userRole } = user; // Lấy ID và vai trò của user

        let filter = {};

        // Admin có thể xem tất cả các cuộc hẹn
        if (userRole === 'Admin') {
            filter = {};
        } else if (userRole === 'Patient') {
            // Patient chỉ được xem các cuộc hẹn của chính họ
            filter.patient = userId;
        } else if (userRole === 'Doctor') {
            // Doctor chỉ được xem các cuộc hẹn liên quan đến họ thông qua workShift
            const workShifts = await WorkShift.find({ doctor: userId });

            if (!workShifts.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No work shifts found for this doctor.'
                });
            }

            filter.workShift = { $in: workShifts.map(ws => ws._id) };
        } else {
            // Vai trò không được phép
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        // Áp dụng bộ lọc ngày (nếu có)
        if (startDate || endDate) {
            filter.requestDate = {};
            if (startDate) {
                filter.requestDate.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.requestDate.$lte = new Date(endDate);
            }
        }

        // Truy vấn các cuộc hẹn dựa trên bộ lọc
        const appointments = await Appointment.find(filter)
            .populate('patient', 'firstName lastName email phone') // Thông tin bệnh nhân
            .populate({
                path: 'workShift',
                select: 'date timeSlot',
                populate: { path: 'doctor', select: 'firstName lastName email phone' } // Thông tin bác sĩ
            })
            .sort({ requestDate: -1 }); // Sắp xếp theo requestDate (mới nhất trước)

        res.status(200).json({ success: true, appointments });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
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
        res.status(200).json({ message: `Appointment status updated to ${status}`, appointment });

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
            .populate({
                path: 'workShift',
                select: 'date timeSlot',
                populate: { path: 'doctor', select: 'firstName lastName email phone' }
            })  // Work shift details

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
        if (appointment.patient.toString() !== userId && appointment.workShift.doctor._id.toString() !== userId) {
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
