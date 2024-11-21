import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);  // Add loading state
    const navigate = useNavigate();

    // Check localStorage for the token when the app starts
    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedUserId = localStorage.getItem("userId");
        if (savedToken) {
            setToken(savedToken);  // If token exists, set it
        }
        if (savedUserId) {
            setUserId(savedUserId);
        }
        setLoading(false);  // Set loading to false after checking
    }, []);

    const login = (token, id) => {
        // Clear previous session (if any)
        localStorage.removeItem('authToken'); // Remove previous token
        localStorage.removeItem("userId");
        // Store the token in localStorage
        setToken(token);  // Update state with the new token
        setUserId(id);

        localStorage.setItem('authToken', token); // Store in localStorage
        localStorage.setItem("userId", id);

        // Navigate to the dashboard
        navigate('/dashboard');
    };

    const logout = () => {
        // Clear user session
        setToken(null); // Clear the current token state first
        setUserId(null);

        localStorage.removeItem('authToken'); // Then remove token from localStorage
        localStorage.removeItem("userId");

        // Ensure navigation happens after token is cleared
        setTimeout(() => {
            navigate('/login');
        }, 0); // Add a slight delay to ensure state updates propagate
    };


    return (
        <AuthContext.Provider value={{ token, userId, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
