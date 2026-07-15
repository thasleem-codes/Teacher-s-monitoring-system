"use client";

import { DailyLogSubmission } from "../../data/mockData";

interface SubmissionReportProps {
  selectedDept: string;
  filteredSubmissions: DailyLogSubmission[];
  timeRange: "today" | "month" | "custom";

  onInspect: (log: DailyLogSubmission) => void;
}

export default function SubmissionReport({
  selectedDept,
  filteredSubmissions,
  timeRange,
  onInspect,
}: SubmissionReportProps) {
  return (
    <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl animate-[fadeInUp_0.3s_ease-out_forwards]">
      <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-white">
            {selectedDept} Submissions Log ({filteredSubmissions.length})
          </h2>

          <p className="text-xs text-slate-400">
            Detailed feed filtered by time period ({timeRange}). Click any log
            to inspect answers or override score.
          </p>
        </div>

        <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Audit Trail Ready
        </span>
      </div>

      <div className="divide-y divide-slate-800/60">
        {filteredSubmissions.length === 0 ? (
          <p className="p-8 text-center text-slate-500 text-sm">
            No submissions found for the selected time range ({timeRange}).
          </p>
        ) : (
          filteredSubmissions.map((log) => (
            <div
              key={log.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-white text-base">
                    {log.teacherName}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      log.status === "Complete"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : log.status === "Overridden"
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20 font-extrabold"
                        : log.status === "Rejected"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}
                  >
                    {log.status}
                  </span>

                  {log.isOverridden ? (
                    <span className="text-[10px] bg-purple-950 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-800">
                      ★ HOD Overridden
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                      ✓ Auto-Verified
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  {log.subject} • Logged on{" "}
                  <span className="text-slate-300 font-medium">
                    {log.rawDate} ({log.date})
                  </span>
                </p>

                {log.adminNotes ? (
                  <div className="mt-2 text-xs bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/30 text-purple-200 flex items-start gap-2 max-w-xl">
                    <span className="text-purple-400">
                      🛡️ HOD Audit Note:
                    </span>

                    <span className="italic">
                      "{log.adminNotes}"
                    </span>
                  </div>
                ) : log.notes ? (
                  <div className="mt-2 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300 flex items-start gap-2 max-w-xl">
                    <span className="text-slate-500">
                      💬 Teacher Remark:
                    </span>

                    <span className="italic">
                      "{log.notes}"
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-right shrink-0">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">
                    Task Score
                  </div>

                  <div
                    className={`text-base font-black ${
                      log.status === "Rejected"
                        ? "text-red-400 line-through"
                        : log.isOverridden
                        ? "text-purple-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {log.score}% Score
                  </div>
                </div>

                <button
                  onClick={() => onInspect(log)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3 rounded-2xl text-xs transition border border-slate-700 flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <span>🔍 Inspect & Verify</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}