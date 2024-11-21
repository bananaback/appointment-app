import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const PrivateRoute = () => {
    const { token, loading } = useAuth();  // Get token and loading state from context

    console.log('token', token);
    console.log('loading', loading);

    // While the token is being fetched, show a loading state
    if (loading) {
        return <div>Loading...</div>;  // You can show a spinner or anything here
    }

    // If there's no token (user not logged in), redirect to login page
    if (!token) {
        console.log('Token not found', token);
        return <Navigate to="/login" />;
    }

    return <Outlet />; // Render the protected route (i.e., dashboard)
};

export default PrivateRoute;
