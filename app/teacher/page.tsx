'use client';

import { useState } from 'react';

// 1. Mock Data simulating questions we will eventually fetch from Django
const mockQuestions = [
  { id: 'q1', text: 'Did you submit the teacher manual today?', type: 'boolean', group: 'common' },
  { id: 'q2', text: 'Did you complete all scheduled IT/Language classes today?', type: 'boolean', group: 'common' },
  { id: 'q3', text: 'As a Class Teacher, did you update the attendance registry?', type: 'boolean', group: 'class_teacher' },
  { id: 'q4', text: "Any specific challenges or remarks from today's sessions?", type: 'text', group: 'common' }
];

export default function TeacherPortal() {
  // 2. State management for the form answers and submission status
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting these answers to what will be our Django API:', answers);
    setSubmitted(true);
  };

  // 3. Success Screen (Renders after the form is submitted)
  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <span className="text-4xl">🎉</span>
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Report Submitted!</h2>
          <p className="text-gray-500 mb-6">Thank you for updating your daily activity log.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-blue-600 font-medium hover:underline"
          >
            Submit another response
          </button>
        </div>
      </main>
    );
  }

  // 4. Main Form Screen
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Daily Activity Report</h1>
          <p className="text-sm text-gray-500 mb-8">Please complete your end-of-day checklist accurately.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mockQuestions.map((q) => (
              <div key={q.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  {q.text}{' '}
                  {q.group === 'class_teacher' && (
                    <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full ml-2">
                      Class Teacher Only
                    </span>
                  )}
                </label>

                {q.type === 'boolean' ? (
                  <div className="flex gap-4">
                    {['Yes', 'No'].map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={option}
                          checked={answers[q.id] === option}
                          onChange={(e) => handleChange(q.id, e.target.value)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
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
                    placeholder="Write your notes here..."
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition shadow-sm"
            >
              Submit Report
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}