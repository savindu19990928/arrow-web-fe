import React from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <p className="headline text-8xl">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold">This road doesn't go anywhere</h1>
      <p className="mt-2 text-muted">The page you're looking for has moved or doesn't exist.</p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="btn-primary">Back home</Link>
        <Link to="/shop" className="btn-outline">Shop e-cycles</Link>
      </div>
    </div>);

}