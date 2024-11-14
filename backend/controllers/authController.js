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

export const register = async (req, res) => {
    const { firstName, lastName, email, phone, password, role, gender, dob, doctorDepartment, docAvatar } = req.body;

    try {
        // Create a new user, now including the dob field
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
            gender,  // Add gender here
            dob,     // Add dob here
            doctorDepartment,
            docAvatar
        });

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
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
        res
            .cookie('authToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
            .status(200)
            .json({ success: true, message: 'Logged in successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Logout
export const logout = (req, res) => {
    res.clearCookie('authToken').status(200).json({ success: true, message: 'Logged out successfully' });
};
