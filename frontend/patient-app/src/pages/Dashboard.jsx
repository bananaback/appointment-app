import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold mb-6 text-center">Welcome to Your Dashboard!</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-medium text-gray-700">Personal Information</h3>
                        <p><strong>Full Name:</strong> John Doe</p>
                        <p><strong>Email:</strong> johndoe@example.com</p>
                        <p><strong>Phone:</strong> +1234567890</p>
                        <p><strong>Date of Birth:</strong> 1985-07-22</p>
                        <p><strong>Gender:</strong> Male</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-medium text-gray-700">Medical History</h3>
                        <p>No medical history available.</p>
                    </div>
                    <div>
                        <button
                            onClick={() => navigate('/update-profile')}
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
