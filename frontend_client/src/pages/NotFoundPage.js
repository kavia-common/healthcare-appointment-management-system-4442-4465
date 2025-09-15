import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container">
      <div className="card">
        <h2>Page not found</h2>
        <p>We couldn't find what you were looking for.</p>
        <Link className="btn" to="/">Go Home</Link>
      </div>
    </div>
  );
}
