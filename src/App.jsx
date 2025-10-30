import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import LenisProvider from './components/LenisProvider';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import JobList from './pages/jobs/JobList';
import EnhancedJobList from './pages/jobs/EnhancedJobList';
import ExternalJobsPage from './pages/jobs/ExternalJobsPage';
import JobDetails from './pages/jobs/JobDetails';
import CreateJob from './pages/jobs/CreateJob';
import ApplicationList from './pages/applications/ApplicationList';
import ApplicationDetails from './pages/applications/ApplicationDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import ResumeBuilder from './pages/ResumeBuilder';
import Contact from './pages/Contact';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          } />
          
                   <Route path="/jobs" element={
                     <ProtectedRoute>
                       <Navbar />
                       <EnhancedJobList />
                     </ProtectedRoute>
                   } />
                   
                   <Route path="/external-jobs" element={
                     <ProtectedRoute>
                       <Navbar />
                       <ExternalJobsPage />
                     </ProtectedRoute>
                   } />
          
          <Route path="/jobs/:id" element={
            <ProtectedRoute>
              <Navbar />
              <JobDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/create-job" element={
            <ProtectedRoute roles={['recruiter', 'admin']}>
              <Navbar />
              <CreateJob />
            </ProtectedRoute>
          } />
          
          <Route path="/applications" element={
            <ProtectedRoute>
              <Navbar />
              <ApplicationList />
            </ProtectedRoute>
          } />
          
          <Route path="/applications/:id" element={
            <ProtectedRoute>
              <Navbar />
              <ApplicationDetails />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <Navbar />
              <Settings />
            </ProtectedRoute>
          } />
          
          <Route path="/messages" element={
            <ProtectedRoute>
              <Navbar />
              <Messages />
            </ProtectedRoute>
          } />
          
          <Route path="/resume-builder" element={
            <ProtectedRoute roles={['student']}>
              <Navbar />
              <ResumeBuilder />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  // Use Vite environment variable for Google Client ID
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LenisProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LenisProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
