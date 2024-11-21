import React from 'react';
import { Outlet, Link } from 'react-router-dom'; // Outlet is for rendering nested routes
import { FaCalendarCheck, FaCalendarAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'; // Medical icons
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { logout } = useAuth(); // Destructure the logout function from AuthContext
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // This will include cookies in the request
            });

            if (response.ok) {
                console.log('Logout successful');
                logout(); // Clear session in AuthContext
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };


    return (
        <div className="flex min-h-screen bg-gradient-to-r from-blue-200 to-blue-500">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg rounded-tr-3xl rounded-br-3xl p-6 space-y-6 flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                    <ul className="mt-8 space-y-6">
                        {/* Appointment Scheduling */}
                        <li>
                        <Link
                            to="/schedule-appointment"
                            className="w-full text-left px-4 py-3 hover:bg-green-100 rounded-lg text-gray-700 font-medium flex items-center space-x-3"
                        >
                            <FaCalendarAlt className="text-xl text-green-600" />
                            <span>Schedule Appointment</span>
                        </Link>
                        </li>

                        {/* View All Appointments */}
                        <li>
                        <Link
                            to="/my-appointments"
                            className="w-full text-left px-4 py-3 hover:bg-green-100 rounded-lg text-gray-700 font-medium flex items-center space-x-3"
                        >
                            <FaCalendarCheck className="text-xl text-blue-600" />
                            <span>My Appointments</span>
                        </Link>
                        </li>

                        {/* Account */}
                        <li>
                            <Link
                                to="/account"
                                className="w-full text-left px-4 py-3 hover:bg-green-100 rounded-lg text-gray-700 font-medium flex items-center space-x-3"
                            >
                                <FaUserCircle className="text-xl text-purple-600" />
                                <span>Account</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Logout Button */}
                <div>
                    <button
                        onClick={handleLogout} // Call the handleLogout function
                        className="w-full text-left px-4 py-3 bg-red-600 text-white hover:bg-red-700 rounded-lg flex items-center space-x-3"
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 p-6 overflow-auto">
                {/* This will render the content based on the active route */}
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
