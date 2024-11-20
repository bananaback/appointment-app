import User from '../models/UserAccount.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES }
    );
};

export const getUserInfo = async (req, res) => {
    const authToken = req.cookies.authToken;

    if (!authToken) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
        const requestingUser = await User.findById(decoded.id);

        if (!requestingUser) {
            return res.status(404).json({ success: false, message: 'Requesting user not found' });
        }

        const { id: targetUserId } = req.params; // Extract target user ID from route parameters

        if (!targetUserId) {
            return res.status(400).json({ success: false, message: 'Target user ID is required' });
        }

        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'Target user not found' });
        }

        // Access control based on role
        if (requestingUser.role === 'Admin') {
            // Admin can see any user's info
            return res.status(200).json({ success: true, user: targetUser });
        } else if (requestingUser.role === 'Doctor') {
            // Doctor can see their own info or any patient's info
            if (
                targetUser.role === 'Patient' ||
                requestingUser._id.toString() === targetUser._id.toString()
            ) {
                return res.status(200).json({ success: true, user: targetUser });
            } else {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }
        } else if (requestingUser.role === 'Patient') {
            // Patient can only see their own info
            if (requestingUser._id.toString() === targetUser._id.toString()) {
                return res.status(200).json({ success: true, user: targetUser });
            } else {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }
        } else {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};


export const register = async (req, res) => {
    const { firstName, lastName, email, phone, password, role, gender, dob, medicalHistory, specialty, experience, docAvatar } = req.body;

    // Validate that essential fields are provided
    if (!firstName || !lastName || !email || !phone || !password || !role || !gender || !dob) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Create a user object based on the provided role
    const userData = {
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
        gender,
        dob,
    };

    // Add role-specific fields
    if (role === 'Patient') {
        if (!medicalHistory) {
            return res.status(400).json({ success: false, message: 'Medical history is required for patients' });
        }
        userData.medicalHistory = medicalHistory;  // Only add medicalHistory if role is 'Patient'
    }

    if (role === 'Doctor') {
        if (!specialty || !experience) {
            return res.status(400).json({ success: false, message: 'Specialty and experience are required for doctors' });
        }
        userData.specialty = specialty;
        userData.experience = experience;
        userData.docAvatar = docAvatar;  // Avatar for doctor
    }

    try {
        // Create the user in the database
        const user = await User.create(userData);

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};



// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        // Send token in both the cookie and the response body
        res
            .cookie('authToken', token, { httpOnly: true, secure: false })
            .status(200)
            .json({ success: true, message: 'Logged in successfully', token });  // Return token here
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Logout
export const logout = (req, res) => {
    res.clearCookie('authToken').status(200).json({ success: true, message: 'Logged out successfully' });
};
