import React, { useEffect, useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';
import { Link } from 'react-router-dom';

export default function NurseDashboard() {
  const api = useApi();
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await api.get('/dashboard/nurse', { token });
      if (!mounted) return;
      setLoading(false);
      if (!res.ok) setErr(res.error);
      else setStats(res.data || { todayAppointments: 0, pendingPatients: 0, doctorsAvailable: 0 });
    })();
    return () => { mounted = false; };
  }, [api, token]);

  if (loading) return <Loader text="Loading nurse dashboard..." />;
  return (
    <div className="container">
      <h2>Nurse Dashboard</h2>
      <ErrorBanner error={err} />
      <div className="row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card"><h3>Today Appointments</h3><div style={{ fontSize: 32, fontWeight: 800 }}>{stats.todayAppointments}</div></div>
        <div className="card"><h3>Pending Patients</h3><div style={{ fontSize: 32, fontWeight: 800 }}>{stats.pendingPatients}</div></div>
        <div className="card"><h3>Doctors Available</h3><div style={{ fontSize: 32, fontWeight: 800 }}>{stats.doctorsAvailable}</div></div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/patients" className="btn">Manage Patients</Link>
          <Link to="/appointments" className="btn secondary">Create Appointment</Link>
          <Link to="/schedules" className="btn ghost">View Doctor Schedules</Link>
        </div>
      </div>
    </div>
  );
}
