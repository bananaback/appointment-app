import UserAccount from '../models/UserAccount.js';
import WorkShift from '../models/WorkShift.js';
import { startOfDay, endOfDay } from 'date-fns';

// Create a new work shift (Admin only)
export const createWorkShift = async (req, res) => {
    try {
        const { doctorId, date, timeSlot } = req.body;

        // Validate doctor role
        const doctor = await UserAccount.findOne({ _id: doctorId, role: 'Doctor' });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Convert the date string to Date and strip time (start of the day)
        const startDate = startOfDay(new Date(date));
        const endDate = endOfDay(new Date(date));

        // Check if a work shift already exists for this doctor on the same date and time slot
        const existingWorkShift = await WorkShift.findOne({
            doctor: doctorId,
            date: { $gte: startDate, $lt: endDate }, // Check if the work shift is on the same day
            timeSlot // Ensure the same time slot does not exist
        });
        if (existingWorkShift) {
            return res.status(400).json({ message: 'A work shift already exists for this doctor on the given date and time slot' });
        }

        // Create a new work shift
        const workShift = new WorkShift({
            doctor: doctorId,
            date: new Date(date),
            timeSlot
        });

        await workShift.save();
        res.status(201).json({ message: 'Work shift created successfully', workShift });
    } catch (error) {
        console.error('Error creating work shift:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};


export const getAllWorkShifts = async (req, res) => {
    try {
        // Extract role and user ID from req.user
        const { role, _id: userId } = req.user;
        const { doctorId, available, startDate, endDate } = req.query;

        let filter = {};

        // Apply filtering for logged-in doctor
        if (role === 'Doctor') {
            filter.doctor = userId; // Only allow viewing work shifts for the logged-in doctor
        }

        // Apply doctorId filter for admin or other roles
        if (doctorId && role !== 'Doctor') {
            filter.doctor = doctorId;
        }

        // Apply date range filter using startDate and endDate
        if (!startDate && !endDate) {
            // If both are not provided, default to today's date
            const today = new Date();
            filter.date = {
                $gte: new Date(today.setHours(0, 0, 0, 0)), // Start of today
                $lte: new Date(today.setHours(23, 59, 59, 999)), // End of today
            };
        } else {
            // Use startDate and endDate if provided
            filter.date = {};
            if (startDate) {
                const parsedStartDate = new Date(startDate);
                filter.date.$gte = new Date(parsedStartDate.setHours(0, 0, 0, 0)); // Start of startDate
            }
            if (endDate) {
                const parsedEndDate = new Date(endDate);
                filter.date.$lte = new Date(parsedEndDate.setHours(23, 59, 59, 999)); // End of endDate
            }
        }

        // Apply availability filter
        if (available) {
            filter.isReserved = available === 'true';
        }

        // Fetch work shifts based on the constructed filter
        const workShifts = await WorkShift.find(filter)
            .populate('doctor', 'firstName lastName')
            .populate({
                path: 'appointment',
                populate: { path: 'patient', select: 'firstName lastName medicalHistory' },
            });

        res.status(200).json(workShifts);
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

        // Convert the date string to Date and strip time (start of the day)
        const startDate = startOfDay(new Date(date));
        const endDate = endOfDay(new Date(date));

        // Check if another work shift already exists for this doctor on the same date and time slot
        const existingWorkShift = await WorkShift.findOne({
            doctor: workShift.doctor,
            date: { $gte: startDate, $lt: endDate }, // Check if the work shift is on the same day
            timeSlot, // Check if the time slot is already taken
            _id: { $ne: id } // Ensure we are not checking the current work shift
        });

        if (existingWorkShift) {
            return res.status(400).json({ message: 'A work shift already exists for this doctor on the given date and time slot' });
        }

        // Proceed with the update if it's within the allowed time frame
        workShift.date = date || workShift.date;
        workShift.timeSlot = timeSlot || workShift.timeSlot;
        await workShift.save();

        res.status(200).json({ message: 'Work shift updated', updatedWorkShift: workShift });
    } catch (error) {
        console.error('Error updating work shift:', error);
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

