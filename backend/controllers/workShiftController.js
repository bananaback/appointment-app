
import UserAccount from '../models/UserAccount.js';
import WorkShift from '../models/WorkShift.js';

// Create a new work shift (Admin only)
export const createWorkShift = async (req, res) => {
    try {
        const { doctorId, date, timeSlot } = req.body;

        // Validate doctor role
        const doctor = await UserAccount.findOne({ _id: doctorId, role: 'Doctor' });
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const workShift = new WorkShift({
            doctor: doctorId,
            date,
            timeSlot
        });

        await workShift.save();
        res.status(201).json({ message: 'Work shift created', workShift });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all work shifts, with optional filtering by doctorId or availability
export const getAllWorkShifts = async (req, res) => {
    try {
        const { doctorId, available } = req.query;
        let filter = {};

        if (doctorId) filter.doctor = doctorId;
        if (available) filter.isReserved = available === 'false';  // true if reserved, false if available

        const workShifts = await WorkShift.find(filter)
            .populate('doctor', 'firstName lastName');

        res.status(200).json(workShifts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a specific work shift by ID (Admin, Doctor, or Patient)
export const getWorkShiftById = async (req, res) => {
    try {
        const { id } = req.params;

        const workShift = await WorkShift.findById(id)
            .populate('doctor', 'firstName lastName')
            .populate({
                path: 'appointment',
                populate: { path: 'patient', select: 'firstName lastName medicalHistory' }
            });

        if (!workShift) return res.status(404).json({ message: 'Work shift not found' });
        res.status(200).json(workShift);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a work shift (Admin only)
export const updateWorkShift = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, timeSlot } = req.body;

        const updatedWorkShift = await WorkShift.findByIdAndUpdate(id, { date, timeSlot }, { new: true });

        if (!updatedWorkShift) return res.status(404).json({ message: 'Work shift not found' });
        res.status(200).json({ message: 'Work shift updated', updatedWorkShift });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a work shift (Admin only)
export const deleteWorkShift = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedWorkShift = await WorkShift.findByIdAndDelete(id);

        if (!deletedWorkShift) return res.status(404).json({ message: 'Work shift not found' });
        res.status(200).json({ message: 'Work shift deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
