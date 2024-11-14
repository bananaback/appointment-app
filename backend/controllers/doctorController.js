import UserAccount from '../models/UserAccount.js';  // Use the same UserAccount schema

// GET all doctors (Admin only)
export const getAllDoctors = async (req, res) => {
    try {
        // Find all users with the role of 'Doctor'
        const doctors = await UserAccount.find({ role: 'Doctor' });
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve doctors', error });
    }
};

// GET doctor by ID (Admin or Doctor)
export const getDoctorById = async (req, res) => {
    try {
        const doctor = await UserAccount.findById(req.params.id);
        if (!doctor || doctor.role !== 'Doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve doctor', error });
    }
};

// POST create a new doctor (Admin only)
export const createDoctor = async (req, res) => {
    const { firstName, lastName, email, phone, password, gender, specialty, experience, docAvatar } = req.body;

    try {
        // Check if the user with the same email or phone already exists
        const existingUser = await UserAccount.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or phone already exists' });
        }

        // Create a new doctor user
        const newDoctor = new UserAccount({
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            role: 'Doctor',  // Set role to 'Doctor'
            specialty,
            experience,
            docAvatar,
        });

        // Save the doctor
        await newDoctor.save();
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create doctor', error });
    }
};

// PUT update a doctor by ID (Admin only)
export const updateDoctor = async (req, res) => {
    try {
        const updatedDoctor = await UserAccount.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDoctor || updatedDoctor.role !== 'Doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update doctor', error });
    }
};

// DELETE a doctor by ID (Admin only)
export const deleteDoctor = async (req, res) => {
    try {
        const deletedDoctor = await UserAccount.findByIdAndDelete(req.params.id);
        if (!deletedDoctor || deletedDoctor.role !== 'Doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete doctor', error });
    }
};
