import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null); // Lưu token xác thực
    const [userId, setUserId] = useState(null); // Lưu userId của người dùng
    const [loading, setLoading] = useState(true); // Trạng thái tải ứng dụng
    const navigate = useNavigate();

    // Kiểm tra token và userId từ localStorage khi ứng dụng khởi chạy
    useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        const savedUserId = localStorage.getItem('userId');

        if (savedToken && savedUserId) {
            setToken(savedToken); // Lưu token vào state
            setUserId(savedUserId); // Lưu userId vào state
        }

        setLoading(false); // Hoàn tất quá trình kiểm tra
    }, []);

    // Hàm đăng nhập: lưu token và userId
    const login = (token, userId) => {
        // Xóa dữ liệu cũ nếu có
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');

        // Lưu token và userId mới vào state và localStorage
        setToken(token);
        setUserId(userId);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);

        // Điều hướng đến dashboard
        navigate('/dashboard');
    };

    // Hàm đăng xuất
    const logout = () => {
        // Xóa token và userId khỏi state và localStorage
        setToken(null);
        setUserId(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');

        // Điều hướng đến trang đăng nhập
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, userId, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook để sử dụng AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
