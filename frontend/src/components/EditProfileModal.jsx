// src/components/EditProfileModal.jsx
import React, { useState, useEffect } from "react";
import { X, User, Lock, Check, Eye, EyeOff } from "lucide-react";
import { updateUser } from "../services/api";

export default function EditProfileModal({ open, onClose, user, onSuccess }) {
  const [name, setName] = useState(user?.name || "");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setName(user.name || "");
  }, [user, open]);

  if (!open) return null;

  const validate = () => {
    setError("");
    if (!name.trim()) return setError("Name cannot be empty");
    if (newPass) {
      if (newPass.length < 6) return setError("New password must be >= 6 chars");
      if (newPass !== confirmPass) return setError("Passwords do not match");
      if (!currentPass) return setError("Enter current password to change password");
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    try {
      const payload = { name };
      if (newPass) payload.currentPassword = currentPass, payload.newPassword = newPass;
      const updated = await updateUser(payload); // expects updated user object
      onSuccess(updated);
      onClose();
    } catch (err) {
      setError(err?.error || err?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl bg-gradient-to-br from-black/60 to-black/40 glass-panel rounded-2xl p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-md hover:bg-white/5">
          <X size={18} />
        </button>

        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
          <User size={18} /> Edit Profile
        </h3>
        <p className="text-sm text-gray-400 mb-6">Change your name or update password. Changes are saved to your account.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full glass-input rounded-md p-3 text-white"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider">Change password (optional)</label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="glass-input rounded-md p-2 text-white md:col-span-1"
                placeholder="Current password"
              />
              <div className="relative md:col-span-1">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full glass-input rounded-md p-2 text-white"
                  placeholder="New password"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2 top-2 text-gray-300">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full glass-input rounded-md p-2 text-white"
                  placeholder="Confirm new password"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-2 text-gray-300">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-300">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2"
            >
              {isSaving ? "Saving..." : <><Check size={16}/> Save</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
