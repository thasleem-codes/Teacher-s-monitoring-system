"use client";

import React from "react";

interface SettingsModalProps {
  isOpen: boolean;
  newUsername: string;
  newPassword: string;

  setNewUsername: React.Dispatch<React.SetStateAction<string>>;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;

  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SettingsModal({
  isOpen,
  newUsername,
  newPassword,
  setNewUsername,
  setNewPassword,
  onClose,
  onSubmit,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl animate-[fadeInUp_0.2s_ease-out_forwards]">
        <h2 className="text-lg font-black mb-1">
          ⚙️ Update Account Settings
        </h2>

        <p className="text-xs text-slate-400 mb-6">
          Change your administrator username and password.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              New Username
            </label>

            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none font-mono"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 font-bold py-3 rounded-xl text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20"
            >
              Save Changes
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}