import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaUserMd, FaSignOutAlt, FaStethoscope, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../context/useAuth';

const Layout = () => {
    const { logout } = useAuth();
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Logout successful');
                logout();
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="flex min-h-screen" style={{ background: 'linear-gradient(to right, #0AD1C8, #118AB2)' }}>
            {/* Sidebar */}
            <div
                className="w-64 shadow-lg rounded-tr-3xl rounded-br-3xl p-6 space-y-6 flex flex-col justify-between"
                style={{ backgroundColor: '#0B6477' }}
            >
                <div>
                    <h1 className="text-3xl font-bold text-white">Doctor Panel</h1>
                    <ul className="mt-8 space-y-6">
                        {/* Dashboard Button */}
                        <li>
                            <Link
                                to="/dashboard"
                                className="w-full text-left px-4 py-3 hover:bg-opacity-80 rounded-lg text-white font-medium flex items-center space-x-3"
                                style={{ backgroundColor: '#0AD1C8' }}
                            >
                                <FaTachometerAlt className="text-xl text-white" />
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        {/* Workshifts Link */}
                        <li>
                            <Link
                                to="/workshifts"
                                className="w-full text-left px-4 py-3 hover:bg-opacity-80 rounded-lg text-white font-medium flex items-center space-x-3"
                                style={{ backgroundColor: '#0AD1C8' }}
                            >
                                <FaStethoscope className="text-xl text-white" />
                                <span>Workshift</span>
                            </Link>
                        </li>

                        {/* Profile Link */}
                        <li>
                            <Link
                                to="/profile"
                                className="w-full text-left px-4 py-3 hover:bg-opacity-80 rounded-lg text-white font-medium flex items-center space-x-3"
                                style={{ backgroundColor: '#0AD1C8' }}
                            >
                                <FaUserMd className="text-xl text-white" />
                                <span>Profile</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Logout Button */}
                <div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-white hover:bg-opacity-80 rounded-lg flex items-center space-x-3"
                        style={{ backgroundColor: '#118AB2' }}
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 p-6 overflow-auto" style={{ backgroundColor: '#EAF4F4' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
