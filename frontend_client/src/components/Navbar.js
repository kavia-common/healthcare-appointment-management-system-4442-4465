import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div>
        <Link to="/" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>HealthCare AMS</Link>
      </div>
      <div className="nav-links">
        {user && (
          <>
            {user.role === 'nurse' && (
              <>
                <Link to="/dashboard/nurse" className={location.pathname === '/dashboard/nurse' ? 'active' : ''}>Dashboard</Link>
                <Link to="/patients">Patients</Link>
                <Link to="/appointments">Appointments</Link>
                <Link to="/schedules">Doctor Schedules</Link>
              </>
            )}
            {user && user.role === 'doctor' && (
              <>
                <Link to="/dashboard/doctor" className={location.pathname === '/dashboard/doctor' ? 'active' : ''}>Dashboard</Link>
                <Link to="/appointments">Appointments</Link>
                <Link to="/schedules">My Schedule</Link>
              </>
            )}
          </>
        )}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span style={{ color: 'var(--text-secondary)' }}>{user.email} • {user.role}</span>
            <button className="btn ghost" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn">Login</Link>
        )}
      </div>
    </nav>
  );
}
