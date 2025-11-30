// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '../services/api';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    getMe()
      .then(() => { if (mounted) setAuthed(true); })
      .catch(() => { if (mounted) setAuthed(false); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => (mounted = false);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Checking authentication...</div>;
  if (!authed) return <Navigate to="/login" replace />;
  return children;
}
