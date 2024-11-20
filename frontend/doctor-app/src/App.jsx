import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import PrivateRoute from './components/PrivateRoute.jsx'; // PrivateRoute for protected routes
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx'
import WorkShifts from './pages/WorkShifts.jsx'
import AppointmentDetail from './pages/AppointmentDetail.jsx';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            {/* The different content pages rendered inside the Layout */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workshifts" element={<WorkShifts />} />
            <Route path="/appointments/:id" element={<AppointmentDetail />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
