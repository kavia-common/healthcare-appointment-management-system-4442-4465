import React, { createContext, useContext, useMemo } from 'react';

/**
 * ApiContext provides a simple wrapper around fetch with:
 * - Base URL from environment
 * - JSON body/response convenience
 * - Error handling with { ok, data, error, status }
 *
 * Requires env var: REACT_APP_API_BASE_URL
 */

const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

  const api = useMemo(() => {
    // PUBLIC_INTERFACE
    async function request(path, { method = 'GET', body, token, headers } = {}) {
      const url = `${baseUrl}${path}`;
      const init = {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(headers || {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      };

      try {
        const res = await fetch(url, init);
        const contentType = res.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');
        const payload = isJson ? await res.json() : await res.text();
        if (!res.ok) {
          return { ok: false, status: res.status, error: payload?.message || payload || 'Request failed', data: null };
        }
        return { ok: true, status: res.status, data: payload, error: null };
      } catch (e) {
        return { ok: false, status: 0, error: e?.message || 'Network error', data: null };
      }
    }

    return {
      baseUrl,
      request,
      get: (p, opts) => request(p, { ...(opts || {}), method: 'GET' }),
      post: (p, body, opts) => request(p, { ...(opts || {}), method: 'POST', body }),
      put: (p, body, opts) => request(p, { ...(opts || {}), method: 'PUT', body }),
      del: (p, opts) => request(p, { ...(opts || {}), method: 'DELETE' }),
    };
  }, [baseUrl]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

// PUBLIC_INTERFACE
export function useApi() {
  /** Returns the API helper functions for making requests. */
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used within ApiProvider');
  return ctx;
}
