import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
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

        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('authToken');

        setToken(null);

        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

