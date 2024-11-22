import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null); // Store user information
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Gọi API lấy thông tin user
                const { data } = await axios.get(
                    `http://localhost:4000/auth/profile`, // URL API
                    { withCredentials: true } // Đảm bảo gửi cookie
                );
                setUserInfo(data.user); // Lưu dữ liệu người dùng
            } catch (error) {
                console.error("Error fetching user info:", error);
                setError("Failed to fetch user information");
            } finally {
                setLoading(false); // Kết thúc trạng thái loading
            }
        };

        fetchUserInfo(); // Gọi hàm khi component mount
    }, []); // Chỉ chạy một lần khi component được render lần đầu

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-lg text-[#0AD1C8]">Loading...</div>;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600 text-xl">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-[#118AB2] min-h-screen py-12 px-6">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-10 border border-[#0AD1C8]">
                {/* Avatar và tên */}
                <div className="text-center mb-10">
                    <img
                        src={userInfo?.docAvatar?.url || "/default-avatar.png"}
                        alt="User Avatar"
                        className="w-40 h-40 rounded-full mx-auto object-cover shadow-md border-4 border-[#0AD1C8]"
                    />
                    <h1 className="text-4xl font-extrabold text-[#0B6477] mt-6">
                        {`${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`}
                    </h1>
                </div>

                {/* Thông tin chi tiết */}
                <div className="space-y-4 text-left text-lg">
                    <p className="text-[#118AB2] flex items-center">
                        <span className="font-semibold w-32 text-[#0B6477]">Email:</span>
                        <span className="text-[#0AD1C8]">{userInfo?.email || "N/A"}</span>
                    </p>
                    <p className="text-[#118AB2] flex items-center">
                        <span className="font-semibold w-32 text-[#0B6477]">Phone:</span>
                        <span className="text-[#0AD1C8]">{userInfo?.phone || "N/A"}</span>
                    </p>
                    <p className="text-[#118AB2] flex items-center">
                        <span className="font-semibold w-32 text-[#0B6477]">Gender:</span>
                        <span className="text-[#0AD1C8]">{userInfo?.gender || "N/A"}</span>
                    </p>
                    <p className="text-[#118AB2] flex items-center">
                        <span className="font-semibold w-32 text-[#0B6477]">Specialty:</span>
                        <span className="text-[#0AD1C8]">{userInfo?.specialty || "N/A"}</span>
                    </p>
                    <p className="text-[#118AB2] flex items-center">
                        <span className="font-semibold w-32 text-[#0B6477]">Experience:</span>
                        <span className="text-[#0AD1C8]">
                            {userInfo?.experience ? `${userInfo.experience} year(s)` : "N/A"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
