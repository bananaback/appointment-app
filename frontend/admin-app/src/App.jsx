import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import LoginPage from './pages/LoginPage'; // Login Page
import Dashboard from './pages/Dashboard'; // Dashboard Page
import DoctorList from './pages/DoctorList'; // Doctor List Page
import AddDoctor from './pages/AddDoctor'; // Add New Doctor Page
import AddAdmin from './pages/AddAdmin'; // Add New Admin Page
import EditDoctor from './pages/EditDoctor'; // Edit Doctor Page
import WorkshiftDetails from './pages/WorkShiftDetails.jsx';
import AddDoctorWorkshift from './pages/AddDoctorWorkshift.jsx';
import Layout from './components/Layout'; // Layout component
import PrivateRoute from './components/PrivateRoute.jsx'; // PrivateRoute for protected routes

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          {/* Layout wraps the protected routes */}
          <Route path="/" element={<Layout />}>
            {/* The different content pages rendered inside the Layout */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/add-admin" element={<AddAdmin />} />
            <Route path="/edit-doctor/:id" element={<EditDoctor />} />
            <Route path="/workshifts" element={<AddDoctorWorkshift />} />
            <Route path="/workshifts/:id" element={<WorkshiftDetails />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
