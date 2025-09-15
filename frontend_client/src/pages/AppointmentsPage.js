import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

/**
 * List appointments for current day (or all). Nurses can create appointments
 * after selecting patient and doctor and available time from schedules.
 * Doctors can only view their appointments.
 */
export default function AppointmentsPage() {
  const api = useApi();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    time: '',
    reason: '',
    fees: '',
  });

  const canCreate = useMemo(() => user?.role === 'nurse', [user]);

  async function load() {
    setLoading(true);
    const [a, p, d] = await Promise.all([
      api.get('/appointments', { token }),
      api.get('/patients', { token }),
      api.get('/users?role=doctor', { token }),
    ]);
    setLoading(false);
    if (!a.ok) setErr(a.error);
    setAppointments(Array.isArray(a.data) ? a.data : []);
    if (p.ok) setPatients(Array.isArray(p.data) ? p.data : []);
    if (d.ok) setDoctors(Array.isArray(d.data) ? d.data : []);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  async function create(e) {
    e.preventDefault();
    if (!canCreate) return;
    if (!form.patientId || !form.doctorId || !form.time) {
      setErr('Patient, Doctor and Time are required');
      return;
    }
    setSaving(true);
    const res = await api.post('/appointments', { ...form, fees: Number(form.fees || 0) }, { token });
    setSaving(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    setForm({ patientId: '', doctorId: '', time: '', reason: '', fees: '' });
    load();
  }

  if (loading) return <Loader text="Loading appointments..." />;

  return (
    <div className="container">
      <h2>Appointments</h2>
      <ErrorBanner error={err} />

      {canCreate && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>Create Appointment</h3>
          <form className="form" onSubmit={create}>
            <div className="row">
              <div>
                <label>Patient</label>
                <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
                  <option value="">Select patient</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label>Doctor</label>
                <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
                  <option value="">Select doctor</option>
                  {doctors.map((d) => <option key={d.id} value={d.id}>{d.name || d.email}</option>)}
                </select>
              </div>
            </div>
            <div className="row">
              <div>
                <label>Time</label>
                <input type="datetime-local" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <div>
                <label>Fees Collected</label>
                <input type="number" min="0" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} />
              </div>
            </div>
            <div>
              <label>Reason</label>
              <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create Appointment'}</button>
          </form>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Appointments List</h3>
        {appointments.length === 0 ? (
          <EmptyState title="No appointments" description="No appointments found for the selected period." />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Fees</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.patientName || a.patient?.name || a.patientId}</td>
                    <td>{a.doctorName || a.doctor?.name || a.doctorId}</td>
                    <td>{a.time}</td>
                    <td>{a.reason}</td>
                    <td>{typeof a.fees === 'number' ? a.fees.toFixed(2) : a.fees}</td>
                    <td>{a.status || 'scheduled'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
