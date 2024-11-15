import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
const AddAdmin = () => {
    // State for handling form input
    const [adminData, setAdminData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        gender: '',
    });


    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(false);

    // Handle input change for all fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminData({
            ...adminData,
            [name]: value,  // This dynamically updates the field based on the 'name' attribute of the input
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Make a POST request to create a new admin
            const response = await axios.post('http://localhost:4000/admins', adminData, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Ensure that HTTP-only cookies are sent along with the request
            });

            // Show success toast
            toast.success('Admin created successfully!');

            // Optionally: Redirect or reset form here if needed
            console.log('Admin created:', response.data);
        } catch (err) {
            console.error('Error creating admin:', err);

            // Show error toast with more specific message
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(`Error: ${err.response.data.message}`);
            } else {
                toast.error('Failed to create admin. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold text-center mb-6">Add New Admin</h1>
                <form onSubmit={handleSubmit}>
                    {/* First Name Input */}
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"  // Ensure the 'name' attribute matches the state key
                            value={adminData.firstName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Last Name Input */}
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"  // Ensure the 'name' attribute matches the state key
                            value={adminData.lastName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"  // Ensure the 'name' attribute matches the state key
                            value={adminData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Phone Input */}
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"  // Ensure the 'name' attribute matches the state key
                            value={adminData.phone}
                            onChange={handleInputChange}
                            required
                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"  // Ensure the 'name' attribute matches the state key
                            value={adminData.password}
                            onChange={handleInputChange}
                            required
                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>

                    {/* Gender Select */}
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            id="gender"
                            name="gender"  // Ensure the 'name' attribute matches the state key
                            value={adminData.gender}
                            onChange={handleInputChange}
                            required
                            className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
                        >
                            {loading ? 'Creating Admin...' : 'Create Admin'}
                        </button>
                    </div>
                </form>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default AddAdmin;
