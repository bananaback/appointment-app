import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    // Giả lập dữ liệu từ API
    const [doctorName, setDoctorName] = useState('Dr. John Doe'); // Thay bằng dữ liệu thật nếu có API
    const [appointments, setAppointments] = useState({
        success: 10,
        pending: 5,
        cancelled: 3
    });

    useEffect(() => {
        // Logic để lấy dữ liệu từ API có thể đặt tại đây
        // setDoctorName(fetchDoctorName());
        // setAppointments(fetchAppointmentData());
    }, []);

    return (
        <div className="bg-gray-100 h-full py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
                    <p className="text-lg text-gray-600">Overview of the system.</p>
                </div>

                {/* Cards for Dashboard Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Hello, Doctor</h2>
                        <p className="text-gray-500 mt-2">Welcome back!</p>
                        <div className="mt-4 text-2xl font-bold text-blue-600">{doctorName}</div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Total Appointments</h2>
                        <p className="text-gray-500 mt-2">Number of appointments today</p>
                        <div className="mt-4 text-2xl font-bold text-green-600">18</div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Appointment Status</h2>
                        <div className="mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg text-gray-600">Successful:</span>
                                <span className="text-xl font-bold text-green-600">{appointments.success}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg text-gray-600">Pending:</span>
                                <span className="text-xl font-bold text-yellow-600">{appointments.pending}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg text-gray-600">Cancelled:</span>
                                <span className="text-xl font-bold text-red-600">{appointments.cancelled}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add More Info Section */}
                <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-700">User Information</h2>
                    <p className="text-lg text-gray-600 mt-4">This section will contain more details about the user. Placeholder content for now.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

