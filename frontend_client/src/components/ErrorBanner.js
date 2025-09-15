import React from 'react';

export default function ErrorBanner({ error }) {
  if (!error) return null;
  return <div className="alert error" role="alert">Error: {String(error)}</div>;
}
