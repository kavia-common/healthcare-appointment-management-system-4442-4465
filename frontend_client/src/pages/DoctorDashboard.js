import React, { useEffect, useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
  const api = useApi();
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await api.get('/dashboard/doctor', { token });
      if (!mounted) return;
      setLoading(false);
      if (!res.ok) setErr(res.error);
      else setSummary(res.data || { today: { appointments: 0, plan: 'off' } });
    })();
    return () => { mounted = false; };
  }, [api, token]);

  if (loading) return <Loader text="Loading doctor dashboard..." />;

  return (
    <div className="container">
      <h2>Doctor Dashboard</h2>
      <ErrorBanner error={err} />
      <div className="row">
        <div className="card">
          <h3>Today's Plan</h3>
          <p style={{ marginTop: 6, color: 'var(--text-secondary)' }}>{summary.today?.plan || 'off'}</p>
          <Link to="/schedules" className="btn">Update Schedule</Link>
        </div>
        <div className="card">
          <h3>Today's Appointments</h3>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{summary.today?.appointments ?? 0}</div>
          <Link to="/appointments" className="btn secondary">View Appointments</Link>
        </div>
      </div>
    </div>
  );
}
