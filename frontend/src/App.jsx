// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import { getMe } from "./services/api";

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    getMe()
      .then((u) => {
        if (!mounted) return;
        setUser(u || null);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      })
      .finally(() => {
        if (!mounted) return;
        setAuthChecked(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // while we check auth, block the UI to avoid route flashes
  if (!authChecked) {
    return (
      <>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <div className="mb-4 animate-spin text-white/70">⭮</div>
            <p className="text-sm text-gray-400">Checking authentication...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/register" element={<RegisterPage user={user} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} user={user} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard setUser={setUser} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
