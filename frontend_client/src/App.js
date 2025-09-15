import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';
import LoginPage from './pages/LoginPage';
import NurseDashboard from './pages/NurseDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import SchedulesPage from './pages/SchedulesPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';

// Guards for routes based on role
function PrivateRoute({ children, allow }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// PUBLIC_INTERFACE
function AppShell() {
  return (
    <div className="App">
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard/nurse"
            element={
              <PrivateRoute allow={['nurse']}>
                <NurseDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/doctor"
            element={
              <PrivateRoute allow={['doctor']}>
                <DoctorDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/patients"
            element={
              <PrivateRoute allow={['nurse']}>
                <PatientsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute allow={['nurse', 'doctor']}>
                <AppointmentsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/schedules"
            element={
              <PrivateRoute allow={['doctor', 'nurse']}>
                <SchedulesPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'nurse' ? '/dashboard/nurse' : '/dashboard/doctor'} replace />;
}

// PUBLIC_INTERFACE
function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
