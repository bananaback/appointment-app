// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const { login } = useAuth(); // Access login function from AuthContext
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();

            // Check if token exists in response
            if (data.token) {
                // Call login function from AuthContext with token
                login({ email: formData.email, token: data.token });

                navigate('/dashboard');  // Redirect to dashboard
            } else {
                throw new Error('Token not received');
            }
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
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
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-sm text-center">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-500 hover:text-blue-700">Register here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
