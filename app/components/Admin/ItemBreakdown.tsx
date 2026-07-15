"use client";

import { DailyLogSubmission, Question } from "../../data/mockData";

interface ItemBreakdownProps {
  selectedBreakdownQuestionId: string;
  setSelectedBreakdownQuestionId: React.Dispatch<
    React.SetStateAction<string>
  >;

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
  return (
    <div className="space-y-6 animate-[fadeInUp_0.3s_ease-out_forwards]">
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>🎯 Item-by-Item Response Breakdown</span>
          </h2>

          <p className="text-xs text-slate-400 mt-0.5">
            Select a checklist question below to isolate which faculty members
            completed or missed that specific task.
          </p>
        </div>

        <div className="w-full md:w-80">
          <select
            value={selectedBreakdownQuestionId}
            onChange={(e) =>
              setSelectedBreakdownQuestionId(e.target.value)
            }
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-semibold focus:border-emerald-500 outline-none cursor-pointer"
          >
            {questionsList.map((q, i) => (
              <option key={q.id} value={q.id}>
                Q{i + 1}: {q.text}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Faculty Response Status ({filteredSubmissions.length} Reports)
          </span>

          <span className="text-xs text-emerald-400 font-mono">
            Filtering: {timeRange}
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {filteredSubmissions.length === 0 ? (
            <p className="p-8 text-center text-slate-500 text-sm">
              No submissions recorded for this time range.
            </p>
          ) : (
            filteredSubmissions.map((log) => {
              const answer =
                log.answers?.[selectedBreakdownQuestionId] ??
                "No Response / N/A";

              const isYes = answer === "Yes";
              const isNo = answer === "No";

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
                        {log.rawDate} ({log.date})
                      </span>
                    </p>
                  </div>

                  <div className="shrink-0">
                    {isYes ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm">
                        <span>✓ Task Completed (YES)</span>
                      </span>
                    ) : isNo ? (
                      <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm animate-pulse">
                        <span>✕ Task Missed (NO)</span>
                      </span>
                    ) : (
                      <div className="max-w-md bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono italic">
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