import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { userId } = useAuth();
    const [userInfo, setUserInfo] = useState(null); // Thông tin người dùng
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const [statusCounts, setStatusCounts] = useState({
        Pending: 0,
        Accepted: 0,
        Rejected: 0,
        Done: 0,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 5;

    // Gọi API để lấy thông tin người dùng
    useEffect(() => {
        const fetchUserInfo = async () => {
            console.log("Fetching user information...");
            try {
                const { data } = await axios.get(
                    `http://localhost:4000/auth/users/${userId}`,
                    { withCredentials: true }
                );
                console.log("User information fetched successfully:", data);
                setUserInfo(data.user);
            } catch (error) {
                console.error("Error fetching user information:", error);
            }
        };

        if (userId) {
            fetchUserInfo();
        }
    }, [userId]);

    useEffect(() => {
        const fetchAppointments = async () => {
            console.log("Starting to fetch appointments...");
            try {
                const { data } = await axios.get(
                    "http://localhost:4000/appointments",
                    { withCredentials: true }
                );
                console.log("Appointments data fetched successfully:", data);
                setAppointments(data.appointments);

                // Lọc các cuộc hẹn trong ngày hôm nay
                const today = new Date();
                const todayAppointments = data.appointments.filter((appointment) => {
                    const appointmentDate = new Date(appointment.workShift.date);
                    return (
                        appointmentDate.getDate() === today.getDate() &&
                        appointmentDate.getMonth() === today.getMonth() &&
                        appointmentDate.getFullYear() === today.getFullYear()
                    );
                });

                setFilteredAppointments(todayAppointments); // Đặt danh sách lọc là các cuộc hẹn hôm nay

                // Tính toán trạng thái cho các cuộc hẹn hôm nay
                const counts = todayAppointments.reduce((acc, appointment) => {
                    acc[appointment.status] = (acc[appointment.status] || 0) + 1;
                    return acc;
                }, { Pending: 0, Accepted: 0, Rejected: 0, Done: 0 });

                setStatusCounts(counts);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            }
        };

        fetchAppointments();
    }, []);

    const filterAppointments = () => {
        let filter = {};

        if (startDate) {
            filter.startDate = new Date(startDate);
        }

        if (endDate) {
            filter.endDate = new Date(endDate);
        }

        if (status) {
            filter.status = status;
        }

        const filtered = appointments.filter((appointment) => {
            const appointmentDate = new Date(appointment.workShift.date);

            const isAfterStartDate = filter.startDate ? appointmentDate >= filter.startDate : true;
            const isBeforeEndDate = filter.endDate ? appointmentDate <= filter.endDate : true;
            const matchesStatus = filter.status ? appointment.status === filter.status : true;

            return isAfterStartDate && isBeforeEndDate && matchesStatus;
        });

        setFilteredAppointments(filtered);
        setCurrentPage(1); // Reset về trang đầu sau khi lọc
    };

    const handleRowClick = (appointmentId) => {
        navigate(`/appointments/${appointmentId}`);
    };

    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = filteredAppointments.slice(
        indexOfFirstAppointment,
        indexOfLastAppointment
    );
    const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="bg-gray-100 h-full py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Dashboard</h1>
                    <p className="text-lg text-gray-600">Overview of the system.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Hello, Doctor</h2>
                        <p className="text-gray-500 mt-2">Welcome back!</p>
                        <div className="mt-4 text-2xl font-bold text-blue-600">
                            {userInfo?.firstName} {userInfo?.lastName}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Total Appointments</h2>
                        <p className="text-gray-500 mt-2">Number of appointments today</p>
                        <div className="mt-4 text-2xl font-bold text-green-600">{filteredAppointments.length}</div>
                    </div>


                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-700">Appointment Status</h2>
                        <div className="mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg text-gray-600">Pending:</span>
                                <span className="text-xl font-bold text-yellow-600">{statusCounts.Pending}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg text-gray-600">Accepted:</span>
                                <span className="text-xl font-bold text-green-600">{statusCounts.Accepted}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg text-gray-600">Rejected:</span>
                                <span className="text-xl font-bold text-red-600">{statusCounts.Rejected}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg text-gray-600">Done:</span>
                                <span className="text-xl font-bold text-green-700">{statusCounts.Done}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700">Filter Appointments</h2>
                    <div className="flex space-x-4 mt-4">
                        <div>
                            <label className="block text-gray-600 mb-2">Start Date</label>
                            <input
                                type="date"
                                className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-2">End Date</label>
                            <input
                                type="date"
                                className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 mb-2">Status</label>
                            <select
                                className="border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>

                        <div className="self-end">
                            <button
                                onClick={filterAppointments}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Appointment List</h2>
                    {filteredAppointments.length > 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Patient</th>
                                        <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Time Slot</th>
                                        <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Date</th>
                                        <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAppointments.map((appointment, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleRowClick(appointment._id)}
                                        >
                                            <td className="px-4 py-2">
                                                {appointment.patient.firstName} {appointment.patient.lastName}
                                            </td>
                                            <td className="px-4 py-2">{appointment.workShift.timeSlot}</td>
                                            <td className="px-4 py-2">
                                                {new Date(appointment.workShift.date).toLocaleDateString()}
                                            </td>
                                            <td
                                                className={`px-4 py-2 font-semibold ${appointment.status === "Rejected"
                                                    ? "text-red-600"
                                                    : appointment.status === "Pending"
                                                        ? "text-yellow-600"
                                                        : appointment.status === "Accepted"
                                                            ? "text-green-600"
                                                            : appointment.status === "Done"
                                                                ? "text-green-700"
                                                                : "text-gray-600"
                                                    }`}
                                            >
                                                {appointment.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    Previous
                                </button>
                                <span className="text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-4">No appointments found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


