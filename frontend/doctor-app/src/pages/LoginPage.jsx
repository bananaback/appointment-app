import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Assuming login function is provided from AuthContext
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login...'); // Debug log
            const response = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            console.log(response); // Log the response object for debugging

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const data = await response.json();
            console.log('Login successful:', data); // Debug log

            if (data.token) {
                login(data.token);
                navigate('/dashboard');
            } else {
                throw new Error('Token not received');
            }
        } catch (err) {
            console.error('Error during login:', err); // Log any error that occurs
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="absolute top-6 left-10">
                <img src={logo} alt="Logo" className="h-20" />
            </div>
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
                <h2 className="text-3xl font-bold text-center text-indigo-600">
                    Welcome, Doctor
                </h2>
                <p className="text-center text-gray-600">
                    We’re glad to have you here. Please log in to access your dashboard.
                </p>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-[#14919B] rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
