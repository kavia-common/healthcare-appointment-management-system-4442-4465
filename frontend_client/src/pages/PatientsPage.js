import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

/**
 * Nurses can view and create patients.
 * Fields: name, place, dateOfBirth, reason, gender
 */
export default function PatientsPage() {
  const api = useApi();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ name: '', place: '', dateOfBirth: '', gender: 'female', reason: '' });
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => form.name && form.dateOfBirth && form.gender, [form]);

  async function load() {
    setLoading(true);
    const res = await api.get('/patients', { token });
    setLoading(false);
    if (!res.ok) setErr(res.error);
    else setPatients(Array.isArray(res.data) ? res.data : []);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line

  async function createPatient(e) {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    const res = await api.post('/patients', form, { token });
    setSaving(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    setForm({ name: '', place: '', dateOfBirth: '', gender: 'female', reason: '' });
    load();
  }

  if (loading) return <Loader text="Loading patients..." />;

  return (
    <div className="container">
      <h2>Patients</h2>
      <ErrorBanner error={err} />
      <div className="row" style={{ alignItems: 'start' }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Add Patient</h3>
          <form className="form" onSubmit={createPatient}>
            <div className="row">
              <div>
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label>Place</label>
                <input value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} />
              </div>
            </div>
            <div className="row">
              <div>
                <label>Date of Birth</label>
                <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} required />
              </div>
              <div>
                <label>Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label>Reason for visit</label>
              <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Eg. Fever" />
            </div>
            <button className="btn" type="submit" disabled={!canSave || saving}>{saving ? 'Saving…' : 'Save Patient'}</button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Patient List</h3>
          {patients.length === 0 ? (
            <EmptyState title="No patients" description="Add your first patient using the form." />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>DOB</th>
                    <th>Place</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id || p.name + p.dateOfBirth}>
                      <td>{p.name}</td>
                      <td>{p.gender}</td>
                      <td>{p.dateOfBirth}</td>
                      <td>{p.place}</td>
                      <td>{p.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
