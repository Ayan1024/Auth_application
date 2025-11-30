// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { loginUser, getMe } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUser, user }) {
  const nav = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  // If app-level user exists, redirect to dashboard immediately
  useEffect(() => {
    if (user) {
      nav("/dashboard");
    } else {
      // lightweight sanity check to avoid double redirect if session exists server-side
      getMe().then((u) => {
        if (u) {
          setUser?.(u);
          nav("/dashboard");
        }
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, nav]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!credentials.email || !credentials.password) {
      setErr("Fill all fields");
      toast.error("Please fill all fields");
      return;
    }

    if (!validateEmail(credentials.email)) {
      setErr("Invalid email format");
      toast.error("Invalid email format");
      return;
    }

    setIsLoading(true);
    try {
      // send login request (backend sets cookie)
      await loginUser(credentials);

      // fetch authenticated user
      const me = await getMe();
      setUser?.(me);

      toast.success("Login successful");
      nav("/dashboard");
    } catch (er) {
      const message = er?.error || er?.message || "Invalid credentials";
      setErr(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 animate-fade-in bg-transparent">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600" />

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to your Automate Reality account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6" aria-live="polite">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500" size={20} />
              <input
                type="email"
                inputMode="email"
                required
                className="w-full glass-input rounded-lg py-3 pl-10 pr-4 transition-colors"
                placeholder="john@example.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                aria-label="Email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />

              <input
                type={showPass ? "text" : "password"}
                required
                className="w-full glass-input rounded-lg py-3 pl-10 pr-12 transition-colors"
                placeholder="••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                aria-label="Password"
              />

              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Inline error */}
          {err && <div className="text-red-400 text-sm">{err}</div>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-700 pt-6">
          <p className="text-gray-400">
            Don't have an account?
            <button onClick={() => nav("/register")} className="text-blue-400 ml-2 underline">
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
