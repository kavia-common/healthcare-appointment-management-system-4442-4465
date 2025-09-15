import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from './ApiContext';

/**
 * AuthContext manages user session, token storage and role-based navigation.
 * It persists session to localStorage and restores on reload.
 */

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const api = useApi();
  const navigate = useNavigate();
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem('session');
    return raw ? JSON.parse(raw) : { user: null, token: null };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // persist session
  useEffect(() => {
    localStorage.setItem('session', JSON.stringify(session));
  }, [session]);

  // PUBLIC_INTERFACE
  async function login({ email, password, role }) {
    setLoading(true);
    setError(null);
    const res = await api.post('/auth/login', { email, password, role });
    setLoading(false);
    if (!res.ok) {
      setError(res.error || 'Login failed');
      return { ok: false, error: res.error };
    }
    const { token, user } = res.data || {};
    setSession({ token, user: user || { email, role } });
    navigate(user?.role === 'nurse' ? '/dashboard/nurse' : '/dashboard/doctor', { replace: true });
    return { ok: true };
  }

  // PUBLIC_INTERFACE
  function logout() {
    setSession({ user: null, token: null });
    navigate('/login', { replace: true });
  }

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      login,
      logout,
      authLoading: loading,
      authError: error,
    }),
    [session, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Provides the current authenticated user and actions login/logout. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
