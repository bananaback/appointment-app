import Appointment from '../models/Appointment.js';
import UserAccount from '../models/UserAccount.js';
import WorkShift from '../models/WorkShift.js';

export const getDashboardStats = async (req, res) => {
    try {
        // Total Appointments
        const totalAppointments = await Appointment.countDocuments();

        // Appointments Today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const appointmentsToday = await Appointment.countDocuments({
            requestDate: { $gte: todayStart, $lte: todayEnd },
        });

        // Pending Appointments
        const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });

        // Total Doctors
        const totalDoctors = await UserAccount.countDocuments({ role: 'Doctor' });

        // Total Patients
        const totalPatients = await UserAccount.countDocuments({ role: 'Patient' });

        // Available Shifts
        const availableShifts = await WorkShift.countDocuments({ isReserved: false });

        // Appointments by Doctor
        const doctorAppointments = await Appointment.aggregate([
            { $lookup: { from: 'useraccounts', localField: 'workShift', foreignField: '_id', as: 'doctorDetails' } },
            { $unwind: '$doctorDetails' },
            { $group: { _id: '$doctorDetails.firstName', count: { $sum: 1 } } },
            { $project: { doctor: '$_id', count: 1, _id: 0 } },
        ]);

        // Role Distribution
        const roles = await UserAccount.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } },
        ]);
        const roleDistribution = roles.reduce((acc, role) => {
            acc[role._id] = role.count;
            return acc;
        }, {});

        // Recent Appointments
        const recentAppointments = await Appointment.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('workShift', 'date timeSlot')
            .populate('patient', 'firstName lastName email');

        // Response
        res.json({
            totalAppointments,
            appointmentsToday,
            pendingAppointments,
            totalDoctors,
            totalPatients,
            availableShifts,
            doctorAppointments,
            roleDistribution,
            recentAppointments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
    }
};

export const createAdminIfNotExist = async () => {
    try {
        // Check if an admin user already exists
        const existingAdmin = await UserAccount.findOne({ role: 'Admin' });

        if (!existingAdmin) {
            // Define admin details
            const adminData = {
                firstName: 'Admin',
                lastName: 'User',
                email: 'votrongtin8820034@gmail.com',  // Update this to a preferred admin email
                phone: '1234567890',
                password: 'admin',  // Set a secure password
                role: 'Admin',
                dob: new Date('1990-01-01'),
                gender: 'Other',
                address: {
                    street: '123 Admin St',
                    city: 'Admin City',
                    state: 'Admin State',
                    zip: '12345',
                }
            };

            // Create a new admin user
            const newAdmin = new UserAccount(adminData);
            await newAdmin.save();

            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

// Controller to fetch admin list (Admin only), with search, filter, and pagination
export const getAdmins = async (req, res) => {
    const { page = 1, limit = 10, search, sort, order = 'asc' } = req.query;
    const skip = (page - 1) * limit;  // Pagination logic: skip the already fetched items

    // Define the base filter for admins (filter only admin users)
    const filter = { role: 'Admin' };

    // Search by name (firstName or lastName)
    if (search) {
        filter.$or = [
            { firstName: new RegExp(search, 'i') },
            { lastName: new RegExp(search, 'i') },
        ];
    }

    // Sorting options
    let sortOptions = {};
    if (sort === 'name_asc') {
        sortOptions.firstName = 'asc';  // Sort by first name in ascending order
    } else if (sort === 'name_desc') {
        sortOptions.firstName = 'desc';  // Sort by first name in descending order
    }

    try {
        // Fetch admins with the applied filters, sorting, and pagination
        const admins = await UserAccount.find(filter)
            .sort(sortOptions)
            .skip(skip)  // Pagination: skip documents based on page number
            .limit(parseInt(limit));  // Limit the number of results

        // Get the total count of admins for pagination
        const totalAdmins = await UserAccount.countDocuments(filter);
        const totalPages = Math.ceil(totalAdmins / limit);  // Calculate total pages

        // Respond with the admin data, total count, and pagination details
        res.json({
            admins,
            totalAdmins,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// GET admin by ID (Admin only)
export const getAdminById = async (req, res) => {
    try {
        const admin = await UserAccount.findOne({ _id: req.params.id, role: 'Admin' });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve admin', error });
    }
};

// POST create a new admin (Admin only)
export const createAdmin = async (req, res) => {
    const { firstName, lastName, email, phone, password, gender } = req.body;

    try {
        // Check if the admin with the same email or phone already exists
        const existingAdmin = await UserAccount.findOne({ $or: [{ email }, { phone }] });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email or phone already exists' });
        }

        // Create a new admin (ensure role is 'Admin')
        const newAdmin = new UserAccount({
            firstName,
            lastName,
            email,
            phone,
            password,
            gender,
            role: 'Admin',  // Ensure the role is Admin
        });

        // Save the admin
        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create admin', error });
    }
};

// PUT update an admin by ID (Admin only)
export const updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await UserAccount.findOneAndUpdate({ _id: req.params.id, role: 'Admin' }, req.body, { new: true });
        if (!updatedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update admin', error });
    }
};

// DELETE an admin by ID (Admin only)
export const deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await UserAccount.findOneAndDelete({ _id: req.params.id, role: 'Admin' });
        if (!deletedAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete admin', error });
    }
};