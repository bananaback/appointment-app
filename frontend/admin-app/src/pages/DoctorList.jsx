import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [sort, setSort] = useState('');
    const [limit, setLimit] = useState(10);
    const navigate = useNavigate(); // Initialize useNavigate

    const fetchDoctors = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/doctors', {
                params: {
                    page,
                    limit,
                    search,
                    specialty,
                    sort,
                },
                withCredentials: true,
            });
            setDoctors(response.data.doctors);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            toast.error('Failed to load doctor list');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDoctors(currentPage);
    }, [currentPage, search, specialty, sort, limit]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleSpecialtyChange = (e) => {
        setSpecialty(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setCurrentPage(1);
    };

    const handleLimitChange = (e) => {
        setLimit(e.target.value);
        setCurrentPage(1);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 mx-1 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} rounded`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    // Handle navigation to EditDoctor page
    const handleDoctorClick = (doctorId) => {
        navigate(`/edit-doctor/${doctorId}`); // Navigate to EditDoctor page with the doctorId
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-5">Doctors List</h1>

            <div className="mb-5 flex gap-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border rounded"
                />
                <select
                    value={specialty}
                    onChange={handleSpecialtyChange}
                    className="px-4 py-2 border rounded"
                >
                    <option value="">All Specialties</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Practice">General Practice</option>
                </select>
                <select
                    value={sort}
                    onChange={handleSortChange}
                    className="px-4 py-2 border rounded"
                >
                    <option value="">Sort by</option>
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="experience_asc">Experience (Low-High)</option>
                    <option value="experience_desc">Experience (High-Low)</option>
                </select>
                <select
                    value={limit}
                    onChange={handleLimitChange}
                    className="px-4 py-2 border rounded"
                >
                    <option value={2}>2 per page</option>
                    <option value={3}>3 per page</option>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="text-center col-span-full">Loading...</div>
                ) : doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <div
                            key={doctor._id}
                            onClick={() => handleDoctorClick(doctor._id)} // Navigate on click
                            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                        >
                            {doctor.docAvatar?.url ? (
                                <img
                                    className="w-full h-56 object-contain"
                                    src={doctor.docAvatar.url}
                                    alt={`${doctor.firstName} ${doctor.lastName}`}
                                />
                            ) : (
                                <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                                    No Avatar Available
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="text-xl font-semibold">
                                    {doctor.firstName} {doctor.lastName}
                                </h3>
                                <p className="text-gray-600">{doctor.specialty || 'Specialty not specified'}</p>
                                <p className="text-gray-500">
                                    {doctor.experience ? `${doctor.experience} years of experience` : 'Experience not specified'}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center col-span-full text-lg text-gray-600">
                        No doctors found matching your filters.
                    </div>
                )}
            </div>

            <div className="mt-5 flex justify-center gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 bg-gray-200 rounded"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {renderPagination()}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 bg-gray-200 rounded"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            <ToastContainer />
        </div>
    );
};

export default DoctorList;
