import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ErrorBanner from '../components/ErrorBanner';

/**
 * Login page with role selector (nurse/doctor).
 * Validates inputs and calls backend /auth/login.
 */
export default function LoginPage() {
  const { login, authLoading, authError } = useAuth();
  const [role, setRole] = useState('nurse');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Email and password are required.');
      return;
    }
    await login({ email, password, role });
  }

  return (
    <div className="container" style={{ maxWidth: 560 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Sign in</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Select your role and enter credentials to continue.</p>
        <ErrorBanner error={localError || authError} />
        <form className="form" onSubmit={onSubmit}>
          <div>
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="nurse">Nurse</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div className="row">
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button className="btn" type="submit" disabled={authLoading}>{authLoading ? 'Signing in…' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  );
}
