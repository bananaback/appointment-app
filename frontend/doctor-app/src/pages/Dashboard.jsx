import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Clock from "../components/Clock";

const Dashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("");
    const [sortOrder, setSortOrder] = useState("ascending"); // Default sort order
    const navigate = useNavigate();

    const [statusCounts, setStatusCounts] = useState({
        Pending: 0,
        Accepted: 0,
        Rejected: 0,
        Done: 0,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 5;

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const { data } = await axios.get(`http://localhost:4000/auth/profile`, { withCredentials: true });
                setUserInfo(data.user);
            } catch (error) {
                console.error("Error fetching user information:", error);
            }
        };
        fetchUserInfo();
    }, []);

    const fetchAppointments = async () => {
        try {
            const { data } = await axios.get("http://localhost:4000/appointments", {
                withCredentials: true,
                params: { startDate, endDate, status },
            });

            const sortedAppointments = data.appointments.sort((a, b) => {
                const dateA = new Date(a.workShift.date);
                const dateB = new Date(b.workShift.date);

                if (dateA - dateB !== 0) {
                    return sortOrder === "descending" ? dateB - dateA : dateA - dateB;
                }

                const [startA] = a.workShift.timeSlot.split("-").map((time) => new Date(`1970-01-01T${time}:00`));
                const [startB] = b.workShift.timeSlot.split("-").map((time) => new Date(`1970-01-01T${time}:00`));

                return sortOrder === "descending" ? startB - startA : startA - startB;
            });

            setAppointments(sortedAppointments);

            const counts = sortedAppointments.reduce(
                (acc, appointment) => {
                    acc[appointment.status] = (acc[appointment.status] || 0) + 1;
                    return acc;
                },
                { Pending: 0, Accepted: 0, Rejected: 0, Done: 0 }
            );

            setStatusCounts(counts);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [startDate, endDate, status, sortOrder]);

    const handleResetFilters = () => {
        setStartDate("");
        setEndDate("");
        setStatus("");
        setSortOrder("ascending");
    };

    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

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

    const handleRowClick = (appointmentId) => {
        navigate(`/appointments/${appointmentId}`);
    };

    return (
        <div className="bg-gray-100 h-full py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <Clock />
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-[#0B6477]">Dashboard</h1>
                    <p className="text-lg text-[#118AB2]">Overview of the system.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-[#0AD1C8]">
                        <h2 className="text-xl font-semibold text-[#0B6477]">Hello, Doctor</h2>
                        <p className="text-[#118AB2] mt-2">Welcome back!</p>
                        <div className="mt-4 text-2xl font-bold text-[#0AD1C8]">
                            {userInfo?.firstName} {userInfo?.lastName}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-[#0AD1C8]">
                        <h2 className="text-xl font-semibold text-[#0B6477]">Total Appointments</h2>
                        <p className="text-[#118AB2] mt-2">Number of appointments</p>
                        <div className="mt-4 text-2xl font-bold text-[#0AD1C8]">{appointments.length}</div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-[#0AD1C8]">
                        <h2 className="text-xl font-semibold text-[#0B6477]">Appointment Status</h2>
                        <div className="mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg text-[#118AB2]">Pending:</span>
                                <span className="text-xl font-bold text-[#0AD1C8]">{statusCounts.Pending}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg text-[#118AB2]">Accepted:</span>
                                <span className="text-xl font-bold text-[#0B6477]">{statusCounts.Accepted}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg text-[#118AB2]">Rejected:</span>
                                <span className="text-xl font-bold text-red-600">{statusCounts.Rejected}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-lg text-[#118AB2]">Done:</span>
                                <span className="text-xl font-bold text-[#0B6477]">{statusCounts.Done}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-[#0B6477]">Filter Appointments</h2>
                    <div className="flex space-x-4 mt-4">
                        <div>
                            <label className="block text-[#118AB2] mb-2">Start Date</label>
                            <input
                                type="date"
                                className="border-[#0AD1C8] rounded-lg shadow-sm focus:border-[#118AB2] focus:ring-[#118AB2] px-4 py-3 text-lg"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[#118AB2] mb-2">End Date</label>
                            <input
                                type="date"
                                className="border-[#0AD1C8] rounded-lg shadow-sm focus:border-[#118AB2] focus:ring-[#118AB2] px-4 py-3 text-lg"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[#118AB2] mb-2">Status</label>
                            <select
                                className="border-[#0AD1C8] rounded-lg shadow-sm focus:border-[#118AB2] focus:ring-[#118AB2] px-4 py-3 text-lg"
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
                        {/* Dropdown for Sort Order */}
                        <div>
                            <label className="block text-[#118AB2] mb-2">Sort Order</label>
                            <select
                                className="border-[#118AB2] rounded-lg shadow-sm focus:border-[#0B6477] focus:ring-[#0B6477] px-4 py-3 text-lg"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="ascending">Ascending</option>
                                <option value="descending">Descending</option>
                            </select>
                        </div>
                        <div className="self-end">
                            <button
                                onClick={handleResetFilters}
                                className="px-6 py-3 bg-[#0AD1C8] text-white text-lg rounded-lg hover:bg-[#0B6477] transition"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-[#0B6477] mb-4">Appointment List</h2>
                    {appointments.length > 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto border border-[#0AD1C8]">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b-2 border-[#118AB2] px-4 py-2 text-left">Patient</th>
                                        <th className="border-b-2 border-[#118AB2] px-4 py-2 text-left">Time Slot</th>
                                        <th className="border-b-2 border-[#118AB2] px-4 py-2 text-left">Date</th>
                                        <th className="border-b-2 border-[#118AB2] px-4 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAppointments.map((appointment, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200 cursor-pointer hover:bg-[#0AD1C8]/20"
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
                                                        ? "text-[#0AD1C8]"
                                                        : appointment.status === "Accepted"
                                                            ? "text-[#0B6477]"
                                                            : appointment.status === "Done"
                                                                ? "text-[#118AB2]"
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
                                    className={`px-4 py-2 bg-[#0AD1C8] text-white rounded-lg hover:bg-[#0B6477] transition ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
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
                                    className={`px-4 py-2 bg-[#0AD1C8] text-white rounded-lg hover:bg-[#0B6477] transition ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-lg text-[#118AB2]">No appointments found.</p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;



