import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Example protected page
import PrivateRoute from './components/PrivateRoute';
import AppointmentForm from './pages/AppointmentForm';
import Layout from './components/Layout';
import MyAppointments from './pages/MyAppointments';
import Account from './pages/Account';

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap your app with AuthProvider */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected route for Dashboard */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule-appointment" element={<AppointmentForm />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Route>

        {/* Add other routes as needed */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
