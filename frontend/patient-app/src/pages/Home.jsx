import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Logo
import largeImage from '../assets/largeImage.png'; // Hình lớn

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center bg-white">
            {/* Logo ở góc trên bên trái */}
            <div className="absolute top-6 left-10">
                <img src={logo} alt="Logo" className="w-20 h-20" />
            </div>

            {/* Thanh điều hướng và các nút ở trên cùng */}
            <div className="absolute top-6 right-10 flex space-x-4">
                <Link to="/login" className="px-5 py-2 rounded-lg bg-[#0AD1C8] text-white font-semibold hover:bg-[#118AB2]">Login</Link>
                <Link to="/register" className="px-5 py-2 rounded-lg bg-[#14919B] text-white font-semibold hover:bg-[#00D890]">Register</Link>
            </div>

            {/* Phần nội dung chính */}
            <div className="flex items-center justify-center w-full mt-24 px-10">
                {/* Phần chữ bên trái */}
                <div className="flex flex-col items-start max-w-lg">
                    <h1 className="text-5xl font-bold text-[#0B6477]">Hospital Appointment Management</h1>
                    <p className="text-2xl text-gray-600 mt-2">Your Health, Our Priority</p>
                    <p className="text-gray-500 mt-4">"Taking control of your health has never been easier. Schedule appointments with trusted professionals, access medical records, and manage your health journey-all in one place."</p>
                    <div className="flex space-x-4 mt-6">
                        <Link to="/login" className="px-5 py-2 rounded-lg bg-[#0AD1C8] text-white font-semibold hover:bg-[#118AB2]">
                            Get Started
                        </Link>
                        <button className="px-5 py-2 rounded-lg border border-gray-300 text-[#0B6477] font-semibold hover:bg-gray-100">Read Our Stories</button>
                    </div>
                </div>

                {/* Hình lớn bên phải */}
                <div className="ml-10 ">
                    <img src={largeImage} alt="Large PNG" className="w-[500px] h-auto" />
                </div>
            </div>
        </div>
    );
};

export default Home;


