import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);  // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');

        if (savedToken ) {
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('authToken', token);

        setToken(token);

        navigate('/profile');
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