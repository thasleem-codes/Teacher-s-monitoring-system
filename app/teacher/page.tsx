"use client";

import { useState } from "react";
import Link from "next/link";
// Fixed the import name here to 'initialQuestions'
import {
  initialTeachers,
  initialQuestions,
  initialSubmissions,
  Teacher,
} from "../data/mockData";

export default function TeacherPortal() {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const currentTeacher: Teacher | undefined = initialTeachers.find(
    (t) => t.id === selectedTeacherId,
  );

  // Real-time Day & Date
  const today = new Date();
  const currentDayName = "Monday"; // For testing Monday manual question
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const todayRawDate = "2026-07-12";

  // Check if this teacher already submitted today
  const hasAlreadySubmittedToday = initialSubmissions.some(
    (sub) =>
      sub.teacherId === selectedTeacherId && sub.rawDate === todayRawDate,
  );

  // Fixed the variable name here to 'initialQuestions'
  const visibleQuestions = initialQuestions.filter((q) => {
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

    if (!currentTeacher) return;

    // 1. Create the new submission record
    const newSubmission: any = {
      id: `s_${Date.now()}`,
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      subject: currentTeacher.subject,
      department: currentTeacher.department,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      rawDate: todayRawDate,
      status: "Complete",
      score: 100,
      tasksCompleted: {
        manualSubmitted: true,
        classesTaken: true,
        registryUpdated: true,
      },
      answers: answers,
    };

    // 2. Push it to our mock database so the app remembers it!
    initialSubmissions.push(newSubmission);

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsStarted(false);
    setSelectedTeacherId("");
    setAnswers({});
  };

  // SCREEN 1: SUCCESS CELEBRATION
  if (submitted) {
    return (
      <main className="min-h-dvh flex flex-col justify-between bg-slate-950 text-white p-6 selection:bg-emerald-600">
        <div className="max-w-md w-full my-auto mx-auto bg-slate-900/90 p-8 rounded-3xl shadow-2xl border border-slate-800 text-center backdrop-blur-md animate-[fadeInUp_0.4s_ease-out_forwards]">
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
            . Your daily activity has been logged for{" "}
            <span className="text-white font-medium">
              {currentTeacher?.department}
            </span>{" "}
            department evaluation.
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

  // SCREEN 2: SELECTION SCREEN
  if (!isStarted) {
    return (
      <main className="relative min-h-dvh flex flex-col justify-between bg-slate-950 text-white overflow-hidden p-6 selection:bg-emerald-600">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

        <header className="w-full max-w-2xl mx-auto flex items-center justify-between py-4 border-b border-slate-900/80 z-10">
          <div className="flex items-center gap-2.5">
            <img
              src="/kite.png"
              alt="KRHS Logo"
              className="w-7 h-7 object-contain"
            />
            <span className="font-bold text-sm tracking-tight text-white">
              KRHS<span className="text-emerald-400"> PORTAL</span>
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800/80"
          >
            ← Back to Home
          </Link>
        </header>

        <div className="max-w-md w-full my-auto mx-auto relative z-10">
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-t-full shadow-lg shadow-emerald-500/50 mb-[-1px] relative z-20" />
          <div className="bg-slate-900/90 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800/80 backdrop-blur-xl animate-[fadeInUp_0.4s_ease-out_forwards]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Step 01 / 02
              </span>
              <span className="text-xs font-medium text-slate-400">
                {currentDayName} • {formattedDate}
              </span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">
              Welcome
            </h1>
            <p className="text-xs text-slate-400 mb-8">
              Select your name to initialize your daily workflow.
            </p>

            <div className="space-y-6">
              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Faculty Directory
                </label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full bg-slate-950/90 border rounded-2xl px-4 py-4 text-left font-semibold text-sm transition-all flex items-center justify-between shadow-inner ${isDropdownOpen ? "border-emerald-500 ring-2 ring-emerald-500/20 text-white" : "border-slate-750 text-slate-200 hover:border-slate-600"}`}
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
                    className={`text-xs text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180 text-emerald-400" : ""}`}
                  >
                    ▼
                  </span>
                </button>

                {isDropdownOpen && (
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden z-30 divide-y divide-slate-800/60 animate-[fadeInUp_0.15s_ease-out_forwards]">
                    {initialTeachers.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTeacherId(t.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`px-4 py-3.5 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between ${selectedTeacherId === t.id ? "bg-emerald-600/15 text-emerald-400 border-l-2 border-emerald-500 font-semibold pl-3.5" : "text-slate-300 hover:bg-slate-800 hover:text-emerald-300"}`}
                      >
                        <span>{t.name}</span>
                        <span className="text-xs text-slate-500 font-normal">
                          {t.department}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                disabled={!selectedTeacherId}
                onClick={() => setIsStarted(true)}
                className={`group w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3 text-sm ${selectedTeacherId ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white shadow-emerald-600/25 cursor-pointer active:scale-[0.98]" : "bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-750/80"}`}
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

  // SCREEN 3: ONE ENTRY PER DAY LOCK SCREEN
  if (hasAlreadySubmittedToday) {
    return (
      <main className="min-h-dvh flex flex-col justify-between bg-slate-950 text-white p-6 selection:bg-emerald-600">
        <div className="max-w-md w-full my-auto mx-auto bg-slate-900/90 p-8 sm:p-10 rounded-3xl shadow-2xl border border-amber-500/30 text-center backdrop-blur-md animate-[fadeInUp_0.4s_ease-out_forwards]">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">
            🔒
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            Checklist Locked
          </h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            <span className="font-bold text-amber-400">
              {currentTeacher?.name}
            </span>{" "}
            has already submitted the daily end-of-day report for{" "}
            <span className="text-white font-medium">{formattedDate}</span>.
          </p>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left mb-8">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
              System Policy
            </div>
            <p className="text-xs text-slate-400">
              To maintain evaluation accuracy, faculty can only record one
              checklist submission per calendar day. If you made an error,
              please contact your department HOD.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsStarted(false)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 px-4 rounded-xl transition text-xs"
            >
              ← Change Name
            </button>
            <Link
              href="/"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-emerald-600/20 text-xs flex items-center justify-center"
            >
              Home Page
            </Link>
          </div>
        </div>
        <footer className="w-full text-center py-4 text-xs text-slate-500">
          Designed by{" "}
          <span className="text-emerald-400 font-semibold">Code Craft</span> |
          6282811230
        </footer>
      </main>
    );
  }

  // SCREEN 4: THE QUESTION FORM
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
              <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-3 py-1.5 rounded-lg border border-slate-700">
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
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-sm font-semibold transition active:scale-[0.98] ${answers[q.id] === option ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20" : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}
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
