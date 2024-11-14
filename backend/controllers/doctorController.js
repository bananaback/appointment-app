import UserAccount from '../models/UserAccount.js';  // Use the same UserAccount schema

// Controller to fetch doctor list with search, filter, and pagination
export const getDoctors = async (req, res) => {
    const { page = 1, limit = 10, search, specialty, sort, order = 'asc' } = req.query;
    const skip = (page - 1) * limit; // Pagination logic: skip the already fetched items

    // Define the base filter for doctors
    const filter = { role: 'Doctor' };

    // Search by name (firstName or lastName)
    if (search) {
        filter.$or = [
            { firstName: new RegExp(search, 'i') },
            { lastName: new RegExp(search, 'i') },
        ];
    }

    // Filter by specialty
    if (specialty) {
        filter.specialty = specialty;
    }

    // Sorting options
    let sortOptions = {};
    if (sort === 'name_asc') {
        sortOptions.firstName = 'asc'; // Sort by first name in ascending order
    } else if (sort === 'name_desc') {
        sortOptions.firstName = 'desc'; // Sort by first name in descending order
    } else if (sort === 'experience_asc') {
        sortOptions.experience = 1; // Sort by experience in ascending order
    } else if (sort === 'experience_desc') {
        sortOptions.experience = -1; // Sort by experience in descending order
    }

    try {
        // Fetch doctors with the applied filters, sorting, and pagination
        const doctors = await UserAccount.find(filter)
            .sort(sortOptions)
            .skip(skip) // Pagination: skip documents based on page number
            .limit(parseInt(limit)); // Limit the number of results

        // Get the total count of doctors for pagination
        const totalDoctors = await UserAccount.countDocuments(filter);
        const totalPages = Math.ceil(totalDoctors / limit); // Calculate total pages

        // Respond with the doctors data, total count, and pagination details
        res.json({
            doctors,
            totalDoctors,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
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
