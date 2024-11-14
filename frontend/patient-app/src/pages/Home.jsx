// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center">
            <div className="text-center p-6 bg-white shadow-lg rounded-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the Appointment System</h1>
                <p className="text-gray-600 mb-6">Manage your appointments with doctors easily!</p>
                <div className="space-x-4">
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
