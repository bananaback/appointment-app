// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        dob: '',
        gender: 'Male',
        role: 'Patient', // Default role is 'Patient', can be changed based on your form logic
        medicalHistory: '',
        specialty: '',
        experience: '',
        docAvatar: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:4000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),  // Ensure formData is structured correctly
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData); // Log the error response from the backend
                throw new Error(errorData.message || 'Failed to register');
            }

            const data = await response.json();
            console.log(data);  // Log the success data for debugging

            navigate('/login');
        } catch (error) {
            setError(error.message); // Show error message on UI
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="absolute top-6 left-10">
                <img src={logo} alt="Logo" className="h-20" />
            </div>
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-4xl font-semibold text-[#0B6477] mb-6 text-center">Register</h2>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {formData.role === 'Patient' && (
                        <div className="mb-4">
                            <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">Medical History</label>
                            <textarea
                                id="medicalHistory"
                                name="medicalHistory"
                                value={formData.medicalHistory}
                                onChange={handleChange}
                                placeholder="List your medical history or conditions"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}
                    {formData.role === 'Doctor' && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Specialty</label>
                                <input
                                    type="text"
                                    id="specialty"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    placeholder="Your specialty"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
                                <textarea
                                    id="experience"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="Your years of experience"
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#14919B] font-bold text-white rounded-md hover:bg-blue-700"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center mt-4">
                    Already have an account?{' '}
                    <span 
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;

