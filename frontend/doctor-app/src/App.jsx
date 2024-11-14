import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import PrivateRoute from './components/PrivateRoute.jsx'; // PrivateRoute for protected routes
import LoginPage from './pages/LoginPage.jsx';
import ProtectedPage from './pages/ProtectedPage.jsx';

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/test-protected" element={<ProtectedPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
