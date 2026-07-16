"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Teacher, Question } from "../data/mockData";
import {
  getTeachers,
  getQuestions,
  submitDailyLog,
  checkTodaySubmission,
} from "../actions";

export default function TeacherPortal() {
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hasAlreadySubmittedToday, setHasAlreadySubmittedToday] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function loadDatabase() {
      const [teachersData, questionsData] = await Promise.all([
        getTeachers(),
        getQuestions(),
      ]);
      if (teachersData.length > 0) setTeachersList(teachersData);
      if (questionsData.length > 0) setQuestionsList(questionsData);
    }
    loadDatabase();
  }, []);

  const todayRawDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function verifyDailyLock() {
      if (selectedTeacherId) {
        const alreadySubmitted = await checkTodaySubmission(
          selectedTeacherId,
          todayRawDate,
        );
        setHasAlreadySubmittedToday(alreadySubmitted);
      }
    }
    verifyDailyLock();
  }, [selectedTeacherId, todayRawDate]);

  const currentTeacher: any = teachersList.find(
    (t) => t.id === selectedTeacherId,
  );

  const filteredTeachers = teachersList.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.department.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const today = new Date();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDayName = daysOfWeek[today.getDay()];
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const visibleQuestions = questionsList.filter((q) => {
    if (q.group === "class_teacher" && !currentTeacher?.isClassTeacher)
      return false;
    if (q.day && q.day !== "Everyday" && q.day !== currentDayName) return false;
    return true;
  });

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTeacher || isSubmitting) return;

    setIsSubmitting(true);

    const newSubmission = {
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
        manualSubmitted: answers["q1"]?.includes("Yes") || false,
        classesTaken: true,
        registryUpdated: true,
      },
      answers: answers,
      notes: "",
    };

    const result = await submitDailyLog(newSubmission);
    setIsSubmitting(false);

    if (result.success) setSubmitted(true);
    else
      alert("⚠️ Database error: Failed to save submission. Please try again.");
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsStarted(false);
    setSelectedTeacherId("");
    setAnswers({});
  };

  // Robust parser for multiple choice options fetched from DB
  const parseCustomOptions = (options: any): string[] => {
    if (Array.isArray(options)) return options;
    if (typeof options === "string") {
      try {
        const parsed = JSON.parse(options);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return options
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

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
            . Your daily activity has been logged.
          </p>
          <Link
            href="/"
            className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
          >
            Return to Home Page →
          </Link>
        </div>
      </main>
    );
  }

  if (!isStarted) {
    return (
      <main className="relative min-h-dvh flex flex-col justify-between bg-slate-950 text-white overflow-hidden p-6 selection:bg-emerald-600">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/20 to-teal-500/20 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

        <header className="w-full max-w-2xl mx-auto flex items-center justify-between py-4 border-b border-slate-900/80 z-10">
          <div className="flex items-center gap-2.5">
            <Image
              src="/kite.png"
              alt="KRHS Logo"
              width={28}
              height={28}
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
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
                  className={`w-full bg-slate-950/90 border rounded-2xl px-4 py-4 text-left font-semibold text-sm transition-all flex items-center justify-between shadow-inner ${isDropdownOpen ? "border-emerald-500 ring-2 ring-emerald-500/20 text-white" : "border-slate-700 text-slate-200 hover:border-slate-600"}`}
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
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setSearchQuery("");
                    }}
                  />
                )}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 flex flex-col max-h-[350px] overflow-hidden animate-[fadeInUp_0.15s_ease-out_forwards]">
                    <div className="p-3 border-b border-slate-800 bg-slate-900 z-10 shrink-0">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                          🔍
                        </span>
                        <input
                          type="text"
                          autoFocus
                          placeholder="Search your name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-8 pr-3 text-sm text-white focus:border-emerald-500 outline-none placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
                      {filteredTeachers.length > 0 ? (
                        filteredTeachers.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setSelectedTeacherId(t.id);
                              setIsDropdownOpen(false);
                              setSearchQuery("");
                            }}
                            className={`px-4 py-3.5 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between ${selectedTeacherId === t.id ? "bg-emerald-600/15 text-emerald-400 border-l-2 border-emerald-500 font-semibold pl-3.5" : "text-slate-300 hover:bg-slate-800 hover:text-emerald-300"}`}
                          >
                            <span>{t.name}</span>
                            <span className="text-xs text-slate-500 font-normal">
                              {t.department}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-sm text-slate-500">
                          No faculty found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={!selectedTeacherId}
                onClick={() => setIsStarted(true)}
                className={`group w-full font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center gap-3 text-sm ${selectedTeacherId ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white shadow-emerald-600/25 cursor-pointer active:scale-[0.98]" : "bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/80"}`}
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
      </main>
    );
  }

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
          <div className="flex gap-3">
            <button
              onClick={handleReset}
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
      </main>
    );
  }

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

                {/* 1. SIMPLE YES / NO */}
                {q.type === "boolean" && (
                  <div className="flex gap-3">
                    {["Yes", "No"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswer(q.id, opt)}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 border ${answers[q.id] === opt ? (opt === "Yes" ? "bg-emerald-600 border-emerald-500 text-white shadow-lg" : "bg-red-500/20 border-red-500/50 text-red-400") : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt ? "border-white" : "border-slate-600"}`}
                        >
                          {answers[q.id] === opt && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. CUSTOM MULTIPLE CHOICE */}
                {q.type === "multiple_choice" && (
                  <div className="flex flex-wrap gap-3">
                    {parseCustomOptions(q.custom_options).map((opt: string) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswer(q.id, opt)}
                        className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl font-bold text-sm transition flex items-center gap-2 border ${answers[q.id] === opt ? "bg-emerald-600 border-emerald-500 text-white shadow-lg" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[q.id] === opt ? "border-white" : "border-slate-600"}`}
                        >
                          {answers[q.id] === opt && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. NUMERIC SCALE */}
                {q.type === "scale" && (
                  <div className="flex flex-wrap gap-2">
                    {Array.from({
                      length: (parseInt(q.scale_limit) || 5) + 1,
                    }).map((_, i) => {
                      const val = i.toString();
                      const label = i === 0 ? "Nil" : val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleAnswer(q.id, val)}
                          className={`w-12 h-12 rounded-full font-bold text-sm transition flex flex-col items-center justify-center border ${answers[q.id] === val ? "bg-emerald-600 border-emerald-500 text-white shadow-lg scale-110" : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 4. CLASS SELECTOR WITH YES/NO CONDITIONAL */}
                {q.type === "class_select" && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      {["Yes", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            if (opt === "No") handleAnswer(q.id, "No");
                            else
                              handleAnswer(
                                q.id,
                                answers[q.id]?.startsWith("Yes")
                                  ? answers[q.id]
                                  : "Yes: ",
                              );
                          }}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 border ${answers[q.id]?.startsWith(opt) ? (opt === "Yes" ? "bg-emerald-600 border-emerald-500 text-white shadow-lg" : "bg-red-500/20 border-red-500/50 text-red-400") : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${answers[q.id]?.startsWith(opt) ? "border-white" : "border-slate-600"}`}
                          >
                            {answers[q.id]?.startsWith(opt) && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          {opt}
                        </button>
                      ))}
                    </div>

                    {answers[q.id]?.startsWith("Yes") && (
                      <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 animate-[fadeInUp_0.2s_ease-out_forwards]">
                        <p className="text-xs text-emerald-400 mb-3 uppercase font-bold tracking-wider">
                          Select classes tested / checked:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(() => {
                            // Using fallback keys in case DB returns snake_case
                            const rawClasses =
                              currentTeacher?.assignedClasses ||
                              currentTeacher?.assigned_classes ||
                              "";
                            const classArray = rawClasses
                              .split(",")
                              .map((c: string) => c.trim())
                              .filter(Boolean);
                            const displayArray =
                              classArray.length > 0
                                ? classArray
                                : ["No classes assigned"];

                            return displayArray.map((className: string) => {
                              const currentSelections = answers[q.id]
                                ? answers[q.id]
                                    .replace(/^Yes:\s*/, "")
                                    .split(", ")
                                    .filter(Boolean)
                                : [];
                              const isSelected =
                                currentSelections.includes(className);

                              return (
                                <button
                                  key={className}
                                  type="button"
                                  onClick={() => {
                                    if (className === "No classes assigned")
                                      return;
                                    let newSelections;
                                    if (isSelected)
                                      newSelections = currentSelections.filter(
                                        (c: string) => c !== className,
                                      );
                                    else
                                      newSelections = [
                                        ...currentSelections,
                                        className,
                                      ];
                                    handleAnswer(
                                      q.id,
                                      `Yes: ${newSelections.join(", ")}`,
                                    );
                                  }}
                                  className={`px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2 border ${isSelected ? "bg-emerald-600/20 border-emerald-500 text-emerald-400" : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800"}`}
                                >
                                  <div
                                    className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-emerald-500 border-emerald-500" : "border-slate-500"}`}
                                  >
                                    {isSelected && (
                                      <span className="text-slate-950 text-[10px]">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                  {className}
                                </button>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. COMPOSITE TYPE */}
                {q.type === "boolean_with_text" && (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      {["Yes", "No"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            if (opt === "No") handleAnswer(q.id, "No");
                            else
                              handleAnswer(
                                q.id,
                                answers[q.id]?.startsWith("Yes")
                                  ? answers[q.id]
                                  : "Yes: ",
                              );
                          }}
                          className={`flex-1 py-3 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 border ${answers[q.id]?.startsWith(opt) ? (opt === "Yes" ? "bg-emerald-600 border-emerald-500 text-white shadow-lg" : "bg-red-500/20 border-red-500/50 text-red-400") : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"}`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${answers[q.id]?.startsWith(opt) ? "border-white" : "border-slate-600"}`}
                          >
                            {answers[q.id]?.startsWith(opt) && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                          {opt}
                        </button>
                      ))}
                    </div>

                    {answers[q.id]?.startsWith("Yes") && (
                      <input
                        type="text"
                        placeholder="Please explain or specify..."
                        value={answers[q.id].replace(/^Yes:\s*/, "")}
                        onChange={(e) =>
                          handleAnswer(q.id, `Yes: ${e.target.value}`)
                        }
                        className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl p-3 text-sm text-emerald-400 outline-none placeholder:text-slate-600 animate-[fadeInUp_0.2s_ease-out_forwards]"
                        autoFocus
                      />
                    )}
                  </div>
                )}

                {/* 6. STANDARD TEXT BOX */}
                {q.type === "text" && (
                  <textarea
                    rows={2}
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    placeholder="Type your explanation here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white outline-none focus:border-emerald-500 transition-colors"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold py-4 px-6 rounded-2xl transition duration-200 shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>
                {isSubmitting ? "Saving to Cloud..." : "Submit Daily Checklist"}
              </span>
              <span>✓</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
