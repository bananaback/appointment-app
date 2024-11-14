// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tailwind's CSS file
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Only wrap the app with BrowserRouter here */}
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
