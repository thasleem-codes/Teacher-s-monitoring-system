'use client';

import { useState } from 'react';
import Link from 'next/link';

// 1. Mock Teacher Database (Will come from Django later)
const mockTeachers = [
  { id: 't1', name: 'Mohammed Thasleem', subject: 'IT / Computer Science', isClassTeacher: true },
  { id: 't2', name: 'Ananya Sharma', subject: 'English Language', isClassTeacher: false },
  { id: 't3', name: 'Rahul Varma', subject: 'Mathematics', isClassTeacher: true },
  { id: 't4', name: 'Sneha Nair', subject: 'Science', isClassTeacher: false },
];

// 2. Mock Question Bank
const mockQuestions = [
  { id: 'q1', text: 'Did you submit the teacher manual today?', type: 'boolean', group: 'common' },
  { id: 'q2', text: 'Did you complete all scheduled IT/Language classes today?', type: 'boolean', group: 'common' },
  { id: 'q3', text: 'As a Class Teacher, did you update the attendance registry?', type: 'boolean', group: 'class_teacher' },
  { id: 'q4', text: "Any specific challenges or remarks from today's sessions?", type: 'text', group: 'common' }
];

export default function TeacherPortal() {
  // State for workflow
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Find the currently selected teacher object
  const currentTeacher = mockTeachers.find((t) => t.id === selectedTeacherId);

  // Smart Filtering: Only show 'class_teacher' questions if the user IS a class teacher
  const visibleQuestions = mockQuestions.filter((q) => {
    if (q.group === 'class_teacher' && !currentTeacher?.isClassTeacher) {
      return false; // Hide this question
    }
    return true; // Show this question
  });

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      teacher: currentTeacher?.name,
      role: currentTeacher?.isClassTeacher ? 'Class Teacher' : 'Subject Teacher',
      submissions: answers
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setIsStarted(false);
    setSelectedTeacherId('');
    setAnswers({});
  };

  // SCREEN 1: Success Celebration Screen
  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Report Submitted!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Great job, <span className="font-semibold text-slate-700">{currentTeacher?.name}</span>. Your daily activity has been logged for admin review.
          </p>
          <button
            onClick={handleReset}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition shadow-md"
          >
            Log Another Response
          </button>
        </div>
      </main>
    );
  }

  // SCREEN 2: Teacher Dropdown Selection Screen
  if (!isStarted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-slate-100 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <Link href="/" className="text-xs font-semibold text-blue-600 hover:underline mb-6 inline-block">
            ← Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👋</span>
            <h1 className="text-2xl font-bold text-slate-900">Welcome, Teacher!</h1>
          </div>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Please select your name from the directory below to access your customized daily checklist.
          </p>

          <div className="space-y-6">
            <div>
              <label htmlFor="teacher-select" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Select Your Profile
              </label>
              <select
                id="teacher-select"
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              >
                <option value="">-- Choose your name --</option>
                {mockTeachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.subject}) {t.isClassTeacher ? '⭐ Class Teacher' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              disabled={!selectedTeacherId}
              onClick={() => setIsStarted(true)}
              className={`w-full font-semibold py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 ${
                selectedTeacherId 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Continue to Report</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // SCREEN 3: The Filtered Daily Question Form
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Navigation & User Badge */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setIsStarted(false)} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
            ← Change Teacher
          </button>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>{currentTeacher?.name}</span>
            {currentTeacher?.isClassTeacher && (
              <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                Class Teacher
              </span>
            )}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Daily Activity Log</h1>
            <p className="text-sm text-slate-500">
              Showing questions tailored for <span className="font-semibold text-slate-700">{currentTeacher?.subject}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {visibleQuestions.map((q, index) => (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 transition hover:border-slate-300">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <label className="block text-sm font-bold text-slate-800 leading-snug">
                    <span className="text-slate-400 mr-2">{index + 1}.</span>
                    {q.text}
                  </label>
                  {q.group === 'class_teacher' && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-1 rounded-md">
                      Class Teacher
                    </span>
                  )}
                </div>

                {q.type === 'boolean' ? (
                  <div className="flex gap-4 pt-1">
                    {['Yes', 'No'].map((option) => (
                      <label
                        key={option}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer text-sm font-semibold transition ${
                          answers[q.id] === option
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="sr-only" // Hides default radio circle for a clean button look
                          required
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    value={answers[q.id] || ''}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    placeholder="Type any remarks, challenges, or student updates here..."
                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <span>Submit Daily Checklist</span>
              <span>✓</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}