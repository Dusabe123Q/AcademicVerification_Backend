import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AlumniManagement from './pages/AlumniManagement';
import StudentManagement from './pages/StudentManagement';
import Verification from './pages/Verification';
import Profile from './pages/Profile';
import CredentialPublicPage from './pages/CredentialPublicPage';
import PublicHome from './pages/PublicHome';
import UserManagement from './pages/UserManagement';
import AuditLog from './pages/AuditLog';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen text-white font-sans relative">
          <Routes>
            {/* Public routes — no login required */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/home" element={<PublicHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify/:serialNumber" element={<CredentialPublicPage />} />

            {/* Protected routes */}
            <Route element={
              <div className="min-h-screen flex flex-col relative z-10 pt-24 pb-12">
                <Navbar />
                <main className="flex-1 max-w-7xl mx-auto w-full px-6">
                  <ProtectedRoute />
                </main>
              </div>
            }>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alumni" element={<AlumniManagement />} />
              <Route path="/students" element={<StudentManagement />} />
              <Route path="/verifications" element={<Verification />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/audit" element={<AuditLog />} />
              <Route path="/users" element={<UserManagement />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
