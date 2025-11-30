// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  User,
  Mail,
  Phone,
  CalendarDays,
  Edit3,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import EditProfileModal from "../components/EditProfileModal";
import { getMe, logoutUser, deleteUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ setUser: setAppUser }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    let mounted = true;
    getMe()
      .then((u) => {
        if (!mounted) return;
        setUser(u);
        if (setAppUser) setAppUser(u);
      })
      .catch(() => {
        nav("/login");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => (mounted = false);
  }, [nav, setAppUser]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out");
    } catch (e) {
      toast.error("Logout failed");
    } finally {
      if (setAppUser) setAppUser(null);
      setUser(null);
      nav("/");
    }
  };

  const handleDeleteAccount = async () => {
    // Double-confirm: immediate and typed confirmation
    const ok = window.confirm(
      "This will permanently delete your account and all associated data. Are you sure?"
    );
    if (!ok) return;

    // Optional: require typing the word DELETE for extra safety
    const typed = window.prompt(
      "Type DELETE to permanently delete your account."
    );
    if (typed !== "DELETE") {
      toast("Delete cancelled", { icon: "✖️" });
      return;
    }

    toast.loading("Deleting account...");
    try {
      await deleteUser(); // backend will clear cookie and delete
      toast.dismiss();
      toast.success("Account deleted");
      if (setAppUser) setAppUser(null);
      setUser(null);
      nav("/");
    } catch (err) {
      toast.dismiss();
      toast.error(err?.error || err?.message || "Delete failed");
    }
  };

  const onUpdateSuccess = (updatedUser) => {
    setUser(updatedUser);
    if (setAppUser) setAppUser(updatedUser);
    toast.success("Profile updated successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mb-4 animate-spin text-white/60">⭮</div>
          <p className="text-sm text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/95 to-black px-4 py-8 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
              <LayoutDashboard className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-xs text-gray-400 mt-1">Welcome back — Automate Reality Labs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/6 hover:bg-white/8 border border-white/6 transition"
              title="Edit profile"
            >
              <Edit3 size={16} /> <span className="hidden sm:inline">Edit Profile</span>
            </button>

            <button
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-700/10 hover:bg-red-700/20 border border-red-700/20 text-red-300 transition"
              title="Delete account"
            >
              <Trash2 size={16} /> <span className="hidden sm:inline">Delete Account</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 text-red-300 transition"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Layout: left profile + right cards */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left profile card */}
          <section className="lg:col-span-1 glass-panel p-6 rounded-2xl">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-pink-500 flex items-center justify-center text-4xl font-extrabold text-white shadow-2xl">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/5 rounded-md px-3 py-2">
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Member since</p>
                    <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/5 pt-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className="w-full text-left px-4 py-2 rounded-lg bg-white/4 hover:bg-white/6"
                >
                  Edit profile details
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="w-full text-left px-4 py-2 rounded-lg bg-red-700/10 hover:bg-red-700/20 text-red-300"
                >
                  Delete account
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </section>

          {/* Right: info cards */}
          <section className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 rounded-lg bg-black/40"><User /></div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Full Name</p>
                <p className="text-lg text-white font-medium">{user.name}</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 rounded-lg bg-black/40"><Mail /></div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-lg text-white font-medium">{user.email}</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 rounded-lg bg-black/40"><Phone /></div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Phone</p>
                <p className="text-lg text-white font-medium">{user.phone || "—"}</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 rounded-lg bg-black/40"><CalendarDays /></div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Registered On</p>
                <p className="text-lg text-white font-medium">{new Date(user.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </section>
        </main>

        {/* Edit modal */}
        <EditProfileModal open={editing} onClose={() => setEditing(false)} user={user} onSuccess={onUpdateSuccess} />
      </div>
    </div>
  );
}
