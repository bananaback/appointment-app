import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const WorkshiftDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workshift, setWorkshift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [formData, setFormData] = useState({ doctor: '', date: '', timeSlot: '' });

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

    useEffect(() => {
        const fetchWorkshift = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/workshifts/${id}`, { withCredentials: true });
                const shift = response.data;
                setWorkshift(shift);

                // Check if the workshift is editable
                const createdAt = new Date(shift.createdAt);
                const now = new Date();
                setIsEditable((now - createdAt) / (1000 * 60) <= 15); // Check if within 15 minutes

                setFormData({
                    doctor: `${shift.doctor.firstName} ${shift.doctor.lastName}`,
                    date: new Date(shift.date).toISOString().split('T')[0],
                    timeSlot: shift.timeSlot,
                });
            } catch (err) {
                setError('Failed to load workshift details.');
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshift();
    }, [id]);

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:4000/workshifts/${id}`,
                {
                    date: formData.date,
                    timeSlot: formData.timeSlot,
                },
                { withCredentials: true }
            );
            toast.success('Workshift updated successfully!'); // Success toast
            setTimeout(() => {
                navigate('/workshifts'); // Navigate after 2 seconds
            }, 2000); // Wait for 2 seconds before navigating
        } catch (err) {
            toast.error('Failed to update workshift.'); // Error toast
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this workshift?')) return;

        try {
            await axios.delete(`http://localhost:4000/workshifts/${id}`, { withCredentials: true });
            toast.success('Workshift deleted successfully!'); // Success toast
            setTimeout(() => {
                navigate('/workshifts'); // Navigate after 2 seconds
            }, 2000); // Wait for 2 seconds before navigating
        } catch (err) {
            toast.error('Failed to delete workshift.'); // Error toast
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-8 bg-white rounded shadow-lg">
            <ToastContainer /> {/* Add ToastContainer here */}
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">Workshift Details</h2>
            <div className="space-y-4">
                {isEditable && (
                    <div className="mb-4 text-green-600 font-semibold">
                        This workshift is editable for the next {15 - Math.floor((new Date() - new Date(workshift.createdAt)) / (1000 * 60))} minutes.
                    </div>
                )}
                <div className="text-lg font-medium text-gray-800">
                    Doctor: {workshift.doctor.firstName} {workshift.doctor.lastName}
                </div>
                <div className="text-gray-600">
                    Date: {new Date(workshift.date).toLocaleDateString()}
                </div>
                <div className="text-gray-600">
                    Time: {workshift.timeSlot}
                </div>
                <div className="text-gray-600">
                    Status: {workshift.isReserved ? 'Reserved' : 'Available'}
                </div>
                {isEditable && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Edit Workshift</h3>
                        <input
                            type="date"
                            className="border p-2 rounded w-full mb-4"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                        <select
                            className="border p-2 rounded w-full mb-4"
                            value={formData.timeSlot}
                            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        >
                            {workshiftOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded"
                            onClick={handleUpdate}
                        >
                            Update
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded ml-2"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkshiftDetails;
