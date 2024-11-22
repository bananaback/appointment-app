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

export const getProfile = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ req.user
        const user = req.user;

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Loại bỏ trường password hoặc các trường nhạy cảm khác trước khi trả về
        const { password, ...userData } = user.toObject();

        // Trả về thông tin người dùng
        return res.status(200).json({ success: true, user: userData });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while fetching profile' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        // Lấy ID từ req.user
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        // Tìm kiếm user theo ID
        const user = await User.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Lấy dữ liệu từ req.body để cập nhật
        const { firstName, lastName, email, phone, dob, currentPassword, newPassword, confirmPassword } = req.body;

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (dob) user.dob = new Date(dob);

        // Xử lý cập nhật mật khẩu
        if (currentPassword || newPassword || confirmPassword) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'All password fields (currentPassword, newPassword, confirmPassword) are required' 
                });
            }

            // Kiểm tra mật khẩu hiện tại
            const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }

            // Kiểm tra xác nhận mật khẩu mới
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ success: false, message: 'New password and confirm password do not match' });
            }

            user.password = newPassword;
        }

        // Lưu thông tin người dùng
        const updatedUser = await user.save();

        // Phản hồi thông tin người dùng đã cập nhật
        return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating profile' });
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
    const { email, password, role } = req.body; // Thêm role vào body
    try {
        const user = await User.findOne({ email }).select('+password +role'); // Lấy thêm role từ database
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Kiểm tra role
        if (user.role !== role) {
            return res.status(403).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        // Gửi token trong cookie và response body
        res
            .cookie('authToken', token, { httpOnly: true, secure: false })
            .status(200)
            .json({ success: true, message: 'Logged in successfully', token}); // Trả thêm role nếu cần
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



// Logout
export const logout = (req, res) => {
    res.clearCookie('authToken').status(200).json({ success: true, message: 'Logged out successfully' });
};