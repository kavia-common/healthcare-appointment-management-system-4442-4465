import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';

/**
 * Doctors can set their daily plan (operation, outpatient, rounds, off).
 * Nurses can view doctors schedule to plan appointments.
 */
export default function SchedulesPage() {
  const api = useApi();
  const { token, user } = useAuth();
  const isDoctor = useMemo(() => user?.role === 'doctor', [user]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    plan: 'off',
  });

  async function load() {
    setLoading(true);
    const res = await api.get('/schedules', { token });
    setLoading(false);
    if (!res.ok) setErr(res.error);
    else setSchedules(Array.isArray(res.data) ? res.data : []);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  async function saveSchedule(e) {
    e.preventDefault();
    setSaving(true);
    const res = await api.post('/schedules', form, { token });
    setSaving(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    load();
  }

  if (loading) return <Loader text="Loading schedules..." />;

  return (
    <div className="container">
      <h2>Doctor Schedules</h2>
      <ErrorBanner error={err} />

      {isDoctor && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>Set My Plan</h3>
          <form className="form" onSubmit={saveSchedule}>
            <div className="row">
              <div>
                <label>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label>Plan</label>
                <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
                  <option value="operation">Operation</option>
                  <option value="outpatient">Outpatient Visit</option>
                  <option value="rounds">Rounds</option>
                  <option value="off">Off</option>
                </select>
              </div>
            </div>
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Plan'}</button>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Schedules</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Doctor</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr key={s.id || s.date + (s.doctorId || '')}>
                  <td>{s.date}</td>
                  <td>{s.doctorName || s.doctor?.name || s.doctorId}</td>
                  <td>{s.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
