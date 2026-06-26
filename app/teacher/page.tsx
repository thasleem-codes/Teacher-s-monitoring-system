"use client";

import { useState } from "react";
import Link from "next/link";
import { mockTeachers, mockQuestions, Teacher } from "../data/mockData";

export default function TeacherPortal() {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const currentTeacher: Teacher | undefined = mockTeachers.find(
    (t) => t.id === selectedTeacherId,
  );
  const today = new Date();

  const currentDayName = today.toLocaleDateString("en-US", { weekday: "long" });

  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Smart Filtering
  const visibleQuestions = mockQuestions.filter((q) => {
    if (q.group === "class_teacher" && !currentTeacher?.isClassTeacher)
      return false;
    if (q.day && q.day !== "Everyday" && q.day !== currentDayName) return false;
    return true;
  });

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      teacher: currentTeacher?.name,
      department: currentTeacher?.department,
      role: currentTeacher?.isClassTeacher
        ? "Class Teacher"
        : "Subject Teacher",
      daySubmitted: currentDayName,
      submissions: answers,
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsStarted(false);
    setSelectedTeacherId("");
    setAnswers({});
  };

  // SCREEN 1: Success Celebration Screen
  if (submitted) {
    return (
      <main className="min-h-dvh flex flex-col justify-between bg-slate-950 text-white p-6 selection:bg-emerald-600">
        <div className="max-w-md w-full my-auto mx-auto bg-slate-900/90 p-8 rounded-3xl shadow-2xl border border-slate-800 text-center animate-[fadeInUp_0.5s_ease-out_forwards] backdrop-blur-md">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
            ✓
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            Report Submitted!
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Great job,{" "}
            <span className="font-semibold text-emerald-400">
              {currentTeacher?.name}
            </span>
            . Your daily activity has been logged.
          </p>

          <Link
            href="/"
            className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
          >
            Return to Home Page →
          </Link>
        </div>

        <footer className="w-full text-center py-4 text-xs text-slate-500">
          Designed by{" "}
          <span className="text-emerald-400 font-semibold">Code Craft</span> |
          6282811230
        </footer>
      </main>
    );
  }

  // SCREEN 2: Teacher Dropdown Selection Screen (With Perfectly Aligned Icon!)
  if (!isStarted) {
    return (
      <main className="relative min-h-dvh flex flex-col justify-between bg-slate-950 text-white overflow-hidden p-6 selection:bg-emerald-600">
        {/* Background Graphics */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] border border-emerald-500/10 rounded-full pointer-events-none -z-10 animate-[spin_40s_linear_infinite] hidden sm:block border-dashed" />

        {/* Top Navbar */}
        <header className="w-full max-w-2xl mx-auto flex items-center justify-between py-4 border-b border-slate-900/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-sm">
              <img
                src="/kite.png"
                alt="KRHS Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              KRHS<span className="text-emerald-400"> PORTAL</span>
            </span>
          </div>
          <Link
            href="/"
            className="group text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 px-3 py-1.5 rounded-lg"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            <span>Back to Home</span>
          </Link>
        </header>

        {/* Center Selection Card */}
        <div className="max-w-md w-full my-auto mx-auto relative z-10">
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-t-full shadow-lg shadow-emerald-500/50 mb-[-1px] relative z-20" />

          <div className="bg-slate-900/90 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800/80 backdrop-blur-xl animate-[fadeInUp_0.5s_ease-out_forwards] relative overflow-visible">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Step 01 / 02
              </span>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>System Active</span>
              </div>
            </div>

            <div className="mb-8 text-left">
              <h1 className="text-3xl font-black text-white tracking-tight">
                Welcome
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Select your name to initialize your daily workflow.
              </p>
            </div>

            {/* CUSTOM EMERALD THEMED DROPDOWN */}
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Faculty Directory
                </label>

                {/* 1. Dropdown Trigger Button (FIXED: Using standard flex gap instead of absolute positioning!) */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full bg-slate-950/90 border rounded-2xl px-4 py-4 text-left font-semibold text-sm transition-all flex items-center justify-between shadow-inner ${
                    isDropdownOpen
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 text-white"
                      : "border-slate-750 text-slate-200 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-base leading-none">
                      👤
                    </span>
                    <span
                      className={
                        selectedTeacherId ? "text-white" : "text-slate-500"
                      }
                    >
                      {currentTeacher
                        ? currentTeacher.name
                        : "-- Choose your name --"}
                    </span>
                  </div>
                  <span
                    className={`text-xs text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-emerald-400" : ""}`}
                  >
                    ▼
                  </span>
                </button>

                {/* Invisible backdrop to close dropdown when clicking outside */}
                {isDropdownOpen && (
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}

                {/* 2. Custom Styled Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden z-30 divide-y divide-slate-800/60 animate-[fadeInUp_0.15s_ease-out_forwards]">
                    {mockTeachers.map((t) => {
                      const isSelected = selectedTeacherId === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            setSelectedTeacherId(t.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`px-4 py-3.5 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between ${
                            isSelected
                              ? "bg-emerald-600/15 text-emerald-400 border-l-2 border-emerald-500 font-semibold pl-3.5"
                              : "text-slate-300 hover:bg-slate-800 hover:text-emerald-300"
                          }`}
                        >
                          <span>{t.name}</span>
                          {isSelected && (
                            <span className="text-emerald-400 text-xs">
                              ✓ Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                disabled={!selectedTeacherId}
                onClick={() => setIsStarted(true)}
                className={`group w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3 text-sm ${
                  selectedTeacherId
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25 cursor-pointer active:scale-[0.98] hover:shadow-emerald-500/40"
                    : "bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-750/80"
                }`}
              >
                <span>Continue to Report</span>
                <span
                  className={`transition-transform duration-300 ${selectedTeacherId ? "group-hover:translate-x-1" : ""}`}
                >
                  →
                </span>
              </button>
            </div>
          </div>
        </div>

        <footer className="w-full text-center py-4 text-xs text-slate-500 z-10">
          Designed by{" "}
          <span className="text-emerald-400 font-semibold">Code Craft</span> |
          6282811230
        </footer>
      </main>
    );
  }

  // SCREEN 3: The Filtered Daily Question Form
  return (
    <main className="min-h-dvh flex flex-col justify-between bg-slate-950 text-white p-4 sm:p-6 selection:bg-emerald-600">
      <div className="max-w-2xl w-full mx-auto my-auto py-6">
        <div className="flex items-center justify-end mb-6">
          <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800 shadow-sm text-xs font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-white">{currentTeacher?.name}</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">
              {currentTeacher?.department}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 p-6 sm:p-10 rounded-3xl shadow-2xl border border-slate-800 backdrop-blur-md animate-[fadeInUp_0.4s_ease-out_forwards]">
          <div className="border-b border-slate-800 pb-6 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
                Daily Activity Log
              </h1>
              <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">
                {currentDayName} • {formattedDate}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Showing checklist tailored for{" "}
              <span className="font-semibold text-emerald-400">
                {currentTeacher?.subject}
              </span>{" "}
              ({currentTeacher?.department}).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {visibleQuestions.map((q, index) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 transition hover:border-slate-700"
              >
                <label className="block text-sm font-bold text-slate-200 leading-snug mb-3">
                  <span className="text-emerald-400 mr-2">{index + 1}.</span>
                  {q.text}
                </label>

                {q.type === "boolean" ? (
                  <div className="flex gap-4 pt-1">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-sm font-semibold transition active:scale-[0.98] ${
                          answers[q.id] === option
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="sr-only"
                          required
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    placeholder="Type any remarks, challenges, or student updates here..."
                    className="w-full rounded-xl border border-slate-800 p-3 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none bg-slate-900 text-white placeholder:text-slate-600 transition"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl transition duration-200 shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Submit Daily Checklist</span>
              <span>✓</span>
            </button>
          </form>
        </div>
      </div>

      <footer className="w-full text-center py-4 text-xs text-slate-500 mt-auto">
        Designed by{" "}
        <span className="text-emerald-400 font-semibold">Code Craft</span> |
        6282811230
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />
    </main>
  );
}
