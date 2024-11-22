
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
        // Extract role and user ID from req.user
        const { role, _id: userId } = req.user;
        const { doctorId, available, startDate, endDate } = req.query;

        let filter = {};

        // Apply filtering for doctors
        if (role === 'Doctor') 
            filter.doctor = userId; // Only allow viewing work shifts for the logged-in doctor

        // Fetch work shifts based on the base filter
        const workShifts = await WorkShift.find(filter)
            .populate('doctor', 'firstName lastName')
            .populate({
                path: 'appointment',
                populate: { path: 'patient', select: 'firstName lastName medicalHistory' },
            });

        // Filter work shifts by availability and date range
        let filteredWorkShifts = workShifts;

        // Apply availability filter
        if (available) {
            const isReserved = available === 'true';
            filteredWorkShifts = filteredWorkShifts.filter(workShift => workShift.isReserved === isReserved);
        }

        // Filter work shifts by date range
        if (!startDate && !endDate) {
            // No startDate and endDate => Filter by today's date
            const today = new Date();
            filteredWorkShifts = filteredWorkShifts.filter(workShift => {
                const workShiftDate = new Date(workShift.date);
                return (
                    workShiftDate.getDate() === today.getDate() &&
                    workShiftDate.getMonth() === today.getMonth() &&
                    workShiftDate.getFullYear() === today.getFullYear()
                );
            });
        } else {
            // Filter by date range if startDate or endDate is provided
            filteredWorkShifts = filteredWorkShifts.filter(workShift => {
                const workShiftDate = new Date(workShift.date);
                const isAfterStartDate = startDate ? workShiftDate >= new Date(startDate) : true;
                const isBeforeEndDate = endDate ? workShiftDate <= new Date(endDate) : true;
                return isAfterStartDate && isBeforeEndDate;
            });
        }

        res.status(200).json(filteredWorkShifts);
    } catch (error) {
        console.error('Error fetching work shifts:', error);
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

// Update a work shift (Admin only) - Allow update only within 15 minutes of creation
export const updateWorkShift = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, timeSlot } = req.body;

        // Find the work shift by ID
        const workShift = await WorkShift.findById(id);

        if (!workShift) {
            return res.status(404).json({ message: 'Work shift not found' });
        }

        // Check if the work shift was created within the last 15 minutes
        const createdAt = new Date(workShift.createdAt);
        const now = new Date();
        const timeDifference = (now - createdAt) / (1000 * 60); // Difference in minutes

        if (timeDifference > 15) {
            return res.status(403).json({ message: 'You can only update the work shift within 15 minutes of its creation' });
        }

        // Proceed with the update if it's within the allowed time frame
        workShift.date = date || workShift.date;
        workShift.timeSlot = timeSlot || workShift.timeSlot;
        await workShift.save();

        res.status(200).json({ message: 'Work shift updated', updatedWorkShift: workShift });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a work shift (Admin only) - Allow delete only within 15 minutes of creation
export const deleteWorkShift = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the work shift by ID
        const workShift = await WorkShift.findById(id);

        if (!workShift) {
            return res.status(404).json({ message: 'Work shift not found' });
        }

        // Check if the work shift was created within the last 15 minutes
        const createdAt = new Date(workShift.createdAt);
        const now = new Date();
        const timeDifference = (now - createdAt) / (1000 * 60); // Difference in minutes

        if (timeDifference > 15) {
            return res.status(403).json({ message: 'You can only delete the work shift within 15 minutes of its creation' });
        }

        // Proceed with the deletion if it's within the allowed time frame
        await WorkShift.findByIdAndDelete(id);

        res.status(200).json({ message: 'Work shift deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

