import React from 'react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="card" role="status" aria-live="polite">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 16, height: 16, border: '3px solid #e5e7eb', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span>{text}</span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
