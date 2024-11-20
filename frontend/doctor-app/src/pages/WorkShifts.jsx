import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const WorkShifts = () => {
    const { userId } = useAuth();
    const [workShifts, setWorkShifts] = useState([]);
    const [filteredWorkShifts, setFilteredWorkShifts] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const shiftsPerPage = 10; // Số ca làm việc mỗi trang

    // Lấy danh sách ca làm việc
    useEffect(() => {
        const fetchWorkShifts = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:4000/workShifts?doctorId=${userId}`,
                    { withCredentials: true }
                );
                setWorkShifts(data);
                setFilteredWorkShifts(data);
            } catch (error) {
                console.error('Error fetching work shifts:', error);
            }
        };

        fetchWorkShifts();
    }, [userId]);

    // Lọc danh sách ca làm việc
    const filterWorkShifts = () => {
        let filter = {};

        // Lọc theo ngày bắt đầu
        if (startDate) {
            filter.startDate = new Date(startDate);
        }

        // Lọc theo ngày kết thúc
        if (endDate) {
            filter.endDate = new Date(endDate);
        }

        // Lọc theo trạng thái
        if (status) {
            filter.status = status;
        }

        const filtered = workShifts.filter((shift) => {
            const shiftDate = new Date(shift.date);
            const isAfterStartDate = filter.startDate ? shiftDate >= filter.startDate : true;
            const isBeforeEndDate = filter.endDate ? shiftDate <= filter.endDate : true;
            const matchesStatus = filter.status
                ? (shift.isReserved ? 'Reserved' : 'Available') === filter.status
                : true;

            return isAfterStartDate && isBeforeEndDate && matchesStatus;
        });

        setFilteredWorkShifts(filtered);
        setCurrentPage(1); // Reset về trang đầu sau khi lọc
    };

    // Xác định các ca làm việc hiển thị trên trang hiện tại
    const indexOfLastShift = currentPage * shiftsPerPage;
    const indexOfFirstShift = indexOfLastShift - shiftsPerPage;
    const currentShifts = filteredWorkShifts.slice(indexOfFirstShift, indexOfLastShift);
    const totalPages = Math.ceil(filteredWorkShifts.length / shiftsPerPage);

    // Điều hướng trang
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
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Work Shifts</h1>
                    <p className="text-lg text-gray-600">Manage your work shifts.</p>
                </div>

                {/* Filter Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700">Filter Work Shifts</h2>
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
                                <option value="Available">Available</option>
                                <option value="Reserved">Reserved</option>
                            </select>
                        </div>

                        <div className="self-end">
                            <button
                                onClick={filterWorkShifts}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Work Shift List */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Work Shift List</h2>
                    {filteredWorkShifts.length > 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Date</th>
                                        <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Time Slot</th>
                                        <th className="border-b-2 border-gray-200 px-4 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentShifts.map((shift, index) => (
                                        <tr key={index} className="border-b border-gray-200">
                                            <td className="px-4 py-2">
                                                {new Date(shift.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2">{shift.timeSlot}</td>
                                            <td
                                                className={`px-4 py-2 font-semibold ${
                                                    shift.isReserved ? 'text-red-600' : 'text-green-600'
                                                }`}
                                            >
                                                {shift.isReserved ? 'Reserved' : 'Available'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
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
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${
                                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No work shifts available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkShifts;
