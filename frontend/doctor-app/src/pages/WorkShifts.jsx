import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

const WorkShifts = () => {
    const { userId, role } = useAuth();
    const [workShifts, setWorkShifts] = useState([]);
    const [filteredWorkShifts, setFilteredWorkShifts] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const shiftsPerPage = 10;
    
    useEffect(() => {
        const fetchWorkShifts = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:4000/workShifts`,
                    {
                        withCredentials: true,
                        params: {
                            doctorId: role === 'doctor' ? userId : undefined,
                        },
                    }
                );
    
                // Lấy ngày hiện tại
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
    
                // Lọc các work shift trong ngày
                const todayShifts = data.filter((shift) => {
                    const shiftDate = new Date(shift.date);
                    shiftDate.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
                    return shiftDate.getTime() === today.getTime();
                });
    
                setWorkShifts(data); // Lưu toàn bộ dữ liệu
                setFilteredWorkShifts(todayShifts); // Hiển thị các ca trong ngày
            } catch (error) {
                console.error('Error fetching work shifts:', error);
            }
        };
    
        fetchWorkShifts();
    }, [userId, role]);
    
    const filterWorkShifts = () => {
        let filter = {};
        if (startDate) filter.startDate = new Date(startDate);
        if (endDate) filter.endDate = new Date(endDate);
        if (status) filter.status = status;
    
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
        setCurrentPage(1);
    };
    
    const indexOfLastShift = currentPage * shiftsPerPage;
    const indexOfFirstShift = indexOfLastShift - shiftsPerPage;
    const currentShifts = filteredWorkShifts.slice(indexOfFirstShift, indexOfLastShift);
    const totalPages = Math.ceil(filteredWorkShifts.length / shiftsPerPage);
    
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
                    <h1 className="text-3xl font-semibold text-[#0B6477]">Work Shifts</h1>
                    <p className="text-lg text-[#118AB2]">Manage your work shifts efficiently.</p>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-[#0B6477]">Filter Work Shifts</h2>
                    <div className="flex space-x-4 mt-4">
                        <div>
                            <label className="block text-[#118AB2] mb-2">Start Date</label>
                            <input
                                type="date"
                                className="border-[#118AB2] rounded-lg shadow-sm focus:border-[#0B6477] focus:ring-[#0B6477] px-4 py-3 text-lg"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[#118AB2] mb-2">End Date</label>
                            <input
                                type="date"
                                className="border-[#118AB2] rounded-lg shadow-sm focus:border-[#0B6477] focus:ring-[#0B6477] px-4 py-3 text-lg"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[#118AB2] mb-2">Status</label>
                            <select
                                className="border-[#118AB2] rounded-lg shadow-sm focus:border-[#0B6477] focus:ring-[#0B6477] px-4 py-3 text-lg"
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
                                className="px-6 py-3 bg-[#0AD1C8] text-white text-lg rounded-lg hover:bg-[#0B6477] transition"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-[#0B6477] mb-4">Work Shift List</h2>
                    {filteredWorkShifts.length > 0 ? (
                        <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b-2 border-[#118AB2] px-4 py-2 text-left text-[#0B6477]">
                                            Date
                                        </th>
                                        <th className="border-b-2 border-[#118AB2] px-4 py-2 text-left text-[#0B6477]">
                                            Time Slot
                                        </th>
                                        <th className="border-b-2 border-[#118AB2] px-4 py-2 text-left text-[#0B6477]">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentShifts.map((shift, index) => (
                                        <tr key={index} className="border-b border-[#118AB2]">
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

                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 bg-[#118AB2] text-white rounded-lg hover:bg-[#0B6477] transition ${
                                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    Previous
                                </button>
                                <span className="text-[#118AB2]">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 bg-[#118AB2] text-white rounded-lg hover:bg-[#0B6477] transition ${
                                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[#0B6477]">No work shifts available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkShifts;
