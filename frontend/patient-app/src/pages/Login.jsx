// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the AuthContext
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth(); // Assuming login function is provided from AuthContext
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log('Attempting login...'); // Debug log

            // Gửi yêu cầu đăng nhập đến API
            const response = await fetch('http://localhost:4000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email, 
                    password, 
                    role: 'Patient' // Thêm role mặc định 
                }),
                credentials: 'include', // Đảm bảo gửi cookie nếu cần
            });

            console.log('Response status:', response.status); // Ghi lại mã trạng thái

            // Kiểm tra nếu phản hồi không thành công
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details from server:', errorData); // Debug lỗi từ server
                throw new Error(errorData.message || 'Invalid email or password');
            }

            // Phân tích dữ liệu JSON từ phản hồi
            const data = await response.json();
            console.log('Login successful, received data:', data); // Log dữ liệu nhận được

            // Kiểm tra dữ liệu trả về
            if (data.token ) {
                // Gọi hàm login từ AuthContext để lưu token và userId
                login(data.token);

                // Chuyển hướng người dùng đến trang dashboard
                navigate("/schedule-appointment");
            } else {
                throw new Error('Invalid server response: Missing token or userId');
            }
        } catch (err) {
            // Xử lý lỗi, hiển thị thông báo lỗi
            console.error('Error during login:', err.message || err); // Debug log
            setError(err.message || 'An error occurred during login'); // Cập nhật lỗi vào state
        }
    };

    const handleNavigateToRegister = () => {
        navigate('/register'); // Redirect to register page
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="absolute top-6 left-10">
                <img src={logo} alt="Logo" className="h-20" />
            </div>
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-4xl font-semibold text-[#0B6477] mb-6 text-center">Login</h2>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#14919B] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button onClick={handleNavigateToRegister} className="text-blue-500 hover:underline">
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
