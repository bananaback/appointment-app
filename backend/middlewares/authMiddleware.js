import jwt from 'jsonwebtoken';
import User from '../models/UserAccount.js';

/**
 * Middleware to check if the user is authenticated and authorized based on their role.
 * @param {Array} allowedRoles - Array of roles that are allowed to access the resource
 */
export const isAuthenticated = (allowedRoles = []) => {
    return async (req, res, next) => {
        const token = req.cookies.authToken;
        if (!token) return res.status(401).json({ message: 'Authentication required' });

        try {
            // Verify JWT token and extract user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await User.findById(decoded.id);
            if (!req.user) throw new Error('User not found');

            // Check if the user's role is authorized
            if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: 'You do not have the required permissions' });
            }

            // Proceed to the next middleware or route handler if authorized
            next();
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' });
        }
    };
};
