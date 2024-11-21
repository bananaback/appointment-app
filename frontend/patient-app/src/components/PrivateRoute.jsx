import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, loading } = useAuth();  // Get user and loading state from context

    console.log('user', user);
    console.log('loading', loading);

    // While the user state is being fetched, show a loading state
    if (loading) {
        return <div>Loading...</div>;  // You can show a spinner or anything here
    }

    // If there's no user (not logged in), redirect to login page
    if (!user) {
        console.log('user not found', user);
        return <Navigate to="/login" />;
    }

    return <Outlet />; // Render the protected route (i.e., dashboard)
};

export default PrivateRoute;
