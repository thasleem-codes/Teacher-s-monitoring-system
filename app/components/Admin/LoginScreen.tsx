"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LoginScreenProps {
  usernameInput: string;
  passwordInput: string;
  loginError: boolean;

  setUsernameInput: React.Dispatch<React.SetStateAction<string>>;
  setPasswordInput: React.Dispatch<React.SetStateAction<string>>;
  setLoginError: React.Dispatch<React.SetStateAction<boolean>>;

  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginScreen({
  usernameInput,
  passwordInput,
  loginError,
  setUsernameInput,
  setPasswordInput,
  setLoginError,
  onSubmit,
}: LoginScreenProps) {
  return (
    <main className="relative min-h-dvh flex flex-col justify-between bg-slate-950 text-white p-6 selection:bg-emerald-600">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/15 to-teal-500/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

      <header className="w-full max-w-md mx-auto flex items-center justify-between py-4 border-b border-slate-900 z-10">
        <div className="flex items-center gap-2.5">
          <Image
            src="/kite.png"
            alt="KRHS Logo"
            width={28}
            height={28}
            style={{ width: "auto", height: "auto" }}
            className="object-contain"
          />

          <span className="font-bold text-sm tracking-tight">
            KRHS<span className="text-emerald-400"> ADMIN</span>
          </span>
        </div>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800"
        >
          ← Back to Home
        </Link>
      </header>

      <div className="max-w-md w-full my-auto mx-auto relative z-10">
        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-t-full shadow-lg shadow-emerald-500/30 mb-[-1px] relative z-20" />

        <div className="bg-slate-900/90 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800/80 backdrop-blur-xl">

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              🔒 Security Gateway
            </span>

            <span className="text-xs font-mono text-slate-500">
              HOD Portal
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black mb-1">
            Admin Login
          </h1>

          <p className="text-xs text-slate-400 mb-6">
            Enter authorization credentials to access evaluations.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Username
              </label>

              <input
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  setLoginError(false);
                }}
                placeholder="Username..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase text-slate-300">
                  Password
                </label>
              </div>

              <input
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setLoginError(false);
                }}
                placeholder="Password..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-xs mt-2 animate-pulse">
                ⚠️ Incorrect username or password.
              </p>
            )}

            <button
              type="submit"
              className="w-full font-bold py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white shadow-xl shadow-emerald-600/20 transition-all text-sm"
            >
              Unlock Command Center →
            </button>

          </form>

        </div>
      </div>

      <footer className="w-full text-center py-4 text-xs text-slate-500">
        Powered by{" "}
        <span className="text-emerald-400 font-semibold">
          Code Craft
        </span>{" "}
        | 6282811230
      </footer>
    </main>
  );
}