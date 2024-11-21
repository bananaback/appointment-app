import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);  // Add loading state
    const navigate = useNavigate();

    // Check localStorage for the token when the app starts
    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            setToken(savedToken);  // If token exists, set it
        }
        setLoading(false);  // Set loading to false after checking
    }, []);

    const login = (token) => {
        // Clear previous session (if any)
        localStorage.removeItem('authToken'); // Remove previous token
        // Store the token in localStorage
        setToken(token);  // Update state with the new token
        localStorage.setItem('authToken', token); // Store in localStorage

        // Navigate to the dashboard
        navigate('/dashboard');
    };

    const logout = () => {
        // Clear user session
        setToken(null); // Clear the current token
        localStorage.removeItem('authToken'); // Remove token from localStorage

        // Redirect to login page
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};