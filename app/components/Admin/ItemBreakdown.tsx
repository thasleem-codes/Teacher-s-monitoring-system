"use client";

import { DailyLogSubmission, Question } from "../../data/mockData";

interface ItemBreakdownProps {
  selectedBreakdownQuestionId: string;
  setSelectedBreakdownQuestionId: React.Dispatch<React.SetStateAction<string>>;
  questionsList: Question[];
  filteredSubmissions: DailyLogSubmission[];
  timeRange: "today" | "month" | "custom";
}

export default function ItemBreakdown({
  selectedBreakdownQuestionId,
  setSelectedBreakdownQuestionId,
  questionsList,
  filteredSubmissions,
  timeRange,
}: ItemBreakdownProps) {
  // 1. Find the currently selected question object
  const activeQuestion = questionsList.find(
    (q) => q.id === selectedBreakdownQuestionId,
  );

  // 2. Filter submissions: only show those that should have answered this question
  // If group is 'class_teacher', only show teachers where the submission record or teacher data indicates they are class teachers.
  // Assuming 'department' or 'isClassTeacher' logic is in your submissions data.
  const relevantSubmissions = filteredSubmissions.filter((log) => {
    if (activeQuestion?.group === "class_teacher") {
      // Check if the specific log or teacher associated with this log is a class teacher
      // You may need to verify your DailyLogSubmission type contains this info
      return (log as any).isClassTeacher === true;
    }
    return true; // For 'common' questions, show everyone
  });

  return (
    <div className="space-y-6 animate-[fadeInUp_0.3s_ease-out_forwards]">
      {/* Header and Filter Selector */}
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            🎯 Item-by-Item Response Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeQuestion?.group === "class_teacher"
              ? "Filtering: Showing only Class Teachers for this question."
              : "Filtering: Showing all faculty responses."}
          </p>
        </div>

        <div className="w-full md:w-80">
          <select
            value={selectedBreakdownQuestionId}
            onChange={(e) => setSelectedBreakdownQuestionId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-semibold focus:border-emerald-500 outline-none cursor-pointer"
          >
            {questionsList.map((q, i) => (
              <option key={q.id} value={q.id}>
                Q{i + 1} (
                {q.group === "class_teacher" ? "Class Teachers Only" : "Common"}
                ): {q.text}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Faculty Response Status ({relevantSubmissions.length} Relevant
            Reports)
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {relevantSubmissions.length === 0 ? (
            <p className="p-8 text-center text-slate-500 text-sm">
              No relevant submissions found for this question and time range.
            </p>
          ) : (
            relevantSubmissions.map((log) => {
              const answer =
                log.answers?.[selectedBreakdownQuestionId] ??
                "No Response / N/A";
              const isYes = answer.toString().startsWith("Yes");
              const isNo = answer.toString().startsWith("No");

              return (
                <div
                  key={log.id}
                  className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">
                        {log.teacherName}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                        {log.department}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {log.subject} • Submitted on{" "}
                      <span className="text-slate-300 font-medium">
                        {log.rawDate}
                      </span>
                    </p>
                  </div>

                  <div className="shrink-0">
                    {answer === "No Response / N/A" ? (
                      <span className="text-slate-600 italic text-xs font-mono">
                        "No Response"
                      </span>
                    ) : isYes ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl font-bold text-xs">
                        ✓ {answer}
                      </span>
                    ) : isNo ? (
                      <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl font-bold text-xs">
                        ✕ {answer}
                      </span>
                    ) : (
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs text-slate-300">
                        "{answer}"
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
