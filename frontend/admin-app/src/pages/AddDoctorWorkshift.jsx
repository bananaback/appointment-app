import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddDoctorWorkshift = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [workshiftDate, setWorkshiftDate] = useState(new Date());
    const [selectedWorkshift, setSelectedWorkshift] = useState('');
    const [workshifts, setWorkshifts] = useState([]);

    // Fetch doctors from the endpoint
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:4000/doctors', { withCredentials: true });
                if (Array.isArray(response.data.doctors)) {
                    setDoctors(response.data.doctors);
                } else {
                    console.error('Expected an array of doctors, but got:', response.data.doctors);
                    setDoctors([]);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setDoctors([]);
            }
        };

        fetchDoctors();
    }, []);

    // Fetch workshifts for a specific doctor using query parameters
    useEffect(() => {
        if (!selectedDoctor) return;

        const fetchWorkshifts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/workshifts', {
                    params: { doctorId: selectedDoctor },
                    withCredentials: true,
                });
                setWorkshifts(response.data || []);
            } catch (error) {
                console.error('Error fetching workshifts:', error);
                setWorkshifts([]);
            }
        };

        fetchWorkshifts();
    }, [selectedDoctor]); // Fetch workshifts when selectedDoctor changes

    // Updated workshift time ranges for shorter slots
    const workshiftOptions = [
        { label: '08:00 AM - 08:30 AM', value: '08:00-08:30' },
        { label: '08:30 AM - 09:00 AM', value: '08:30-09:00' },
        { label: '09:00 AM - 09:30 AM', value: '09:00-09:30' },
        { label: '09:30 AM - 10:00 AM', value: '09:30-10:00' },
        { label: '10:00 AM - 10:30 AM', value: '10:00-10:30' },
        { label: '10:30 AM - 11:00 AM', value: '10:30-11:00' },
        { label: '11:00 AM - 11:30 AM', value: '11:00-11:30' },
        { label: '11:30 AM - 12:00 PM', value: '11:30-12:00' },
        { label: '01:00 PM - 01:30 PM', value: '13:00-13:30' },
        { label: '01:30 PM - 02:00 PM', value: '13:30-14:00' },
        { label: '02:00 PM - 02:30 PM', value: '14:00-14:30' },
        { label: '02:30 PM - 03:00 PM', value: '14:30-15:00' },
        { label: '03:00 PM - 03:30 PM', value: '15:00-15:30' },
        { label: '03:30 PM - 04:00 PM', value: '15:30-16:00' },
        { label: '04:00 PM - 04:30 PM', value: '16:00-16:30' },
    ];

    // Handle adding a new workshift
    const handleAddWorkshift = async () => {
        if (!selectedDoctor || !selectedWorkshift) {
            toast.error('Please select a doctor and workshift time!');
            return;
        }

        const newWorkshift = { doctorId: selectedDoctor, date: workshiftDate, timeSlot: selectedWorkshift };

        try {
            const response = await axios.post('http://localhost:4000/workshifts', newWorkshift, {
                withCredentials: true,
            });

            if (response.status === 201) {
                toast.success('Workshift added successfully!');

                // Fetch updated workshifts after successful addition
                fetchWorkshifts(); // Trigger re-fetching the workshifts list

            }
        } catch (error) {
            console.error('Error creating workshift:', error);
            toast.error('Error creating workshift. Please try again.');
        }
    };

    // Fetch workshifts again to reflect the new workshift
    const fetchWorkshifts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/workshifts', {
                params: { doctorId: selectedDoctor },
                withCredentials: true,
            });
            setWorkshifts(response.data || []);
        } catch (error) {
            console.error('Error fetching workshifts:', error);
            setWorkshifts([]);
        }
    };

    // Clear form after adding workshift
    const clearForm = () => {
        setSelectedDoctor('');
        setWorkshiftDate(new Date());
        setSelectedWorkshift('');
    };

    return (
        <div className="p-8 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">Add Doctor Workshift</h2>

            <div className="grid grid-cols-3 gap-8">
                {/* Left Column: Doctor Selection, Date Picker, and Workshift List */}
                <div className="col-span-2 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Doctor</label>
                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border rounded-md"
                        >
                            <option value="">-- Select Doctor --</option>
                            {doctors.map((doctor) => (
                                <option key={doctor._id} value={doctor._id}>
                                    {doctor.firstName} {doctor.lastName} - {doctor.specialty}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Workshift Date</label>
                        <DatePicker
                            selected={workshiftDate}
                            onChange={(date) => setWorkshiftDate(date)}
                            dateFormat="yyyy/MM/dd"
                            className="w-full px-4 py-2 mt-1 border rounded-md"
                        />
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Workshift List</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {workshifts
                                .filter(
                                    (shift) =>
                                        shift.doctor._id === selectedDoctor &&
                                        new Date(shift.date).toDateString() === workshiftDate.toDateString()
                                )
                                .map((shift) => (
                                    <div
                                        key={shift._id}
                                        className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:bg-indigo-50 transition duration-300"
                                    >
                                        <div className="font-medium text-gray-700 text-lg mb-2">
                                            Doctor: {shift.doctor.firstName} {shift.doctor.lastName}
                                        </div>
                                        <div className="text-gray-500 mb-2">
                                            Date: {new Date(shift.date).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-400 mb-2">
                                            Time: {shift.timeSlot}
                                        </div>
                                        <div
                                            className={`text-sm ${shift.isReserved ? 'text-red-500' : 'text-green-500'
                                                } font-semibold`}
                                        >
                                            {shift.isReserved ? 'Reserved' : 'Available'}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Workshift Time and Add Button */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Workshift Time</label>
                        <select
                            value={selectedWorkshift}
                            onChange={(e) => setSelectedWorkshift(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border rounded-md"
                        >
                            <option value="">-- Select Workshift Time --</option>
                            {workshiftOptions.map((shift) => (
                                <option key={shift.value} value={shift.value}>
                                    {shift.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleAddWorkshift}
                        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
                    >
                        Add Workshift
                    </button>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default AddDoctorWorkshift;
