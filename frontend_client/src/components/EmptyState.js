import React from 'react';

export default function EmptyState({ title = 'No data', description, action }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {description && <p style={{ color: 'var(--text-secondary)' }}>{description}</p>}
      {action}
    </div>
  );
}
