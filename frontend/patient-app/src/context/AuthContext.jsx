import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);  // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
        if (token) {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
                setUser(userData);
            }
        }
        setLoading(false);  // Set loading to false after checking
    }, []);

    const login = (userData) => {
        // Clear previous session (if any)
        localStorage.removeItem('user');
        document.cookie = 'authToken=; Max-Age=0'; // Remove any existing authToken from cookies

        // Set new user data
        setUser(userData);  // Assuming setUser updates the app's state with the user data
        localStorage.setItem('user', JSON.stringify(userData)); // Store new user in localStorage
        document.cookie = `authToken=${userData.token}; path=/`; // Store new authToken in cookies

        // Navigate to the dashboard
        navigate('/dashboard');
    };

    const logout = () => {
        // Clear user session
        setUser(null); // Clear the current user state
        localStorage.removeItem('user'); // Remove user data from localStorage
        document.cookie = 'authToken=; Max-Age=0'; // Remove the authToken cookie by setting its Max-Age to 0

        // Redirect to login page
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
