"use client";

import React from "react";
import { DailyLogSubmission, Question } from "../../data/mockData";

interface AuditModalProps {
  selectedAuditLog: DailyLogSubmission | null;
  questionsList: Question[];

  overrideScore: number;
  setOverrideScore: React.Dispatch<React.SetStateAction<number>>;

  overrideStatus: string;
  setOverrideStatus: React.Dispatch<React.SetStateAction<any>>;

  adminAuditNote: string;
  setAdminAuditNote: React.Dispatch<React.SetStateAction<string>>;

  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AuditModal({
  selectedAuditLog,
  questionsList,
  overrideScore,
  setOverrideScore,
  overrideStatus,
  setOverrideStatus,
  adminAuditNote,
  setAdminAuditNote,
  onClose,
  onSubmit,
}: AuditModalProps) {
  if (!selectedAuditLog) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-[fadeInUp_0.2s_ease-out_forwards]">

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                {selectedAuditLog.teacherName}
              </h2>

              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-md border border-slate-700">
                {selectedAuditLog.department}
              </span>

              {selectedAuditLog.isOverridden ? (
                <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded-full border border-purple-500/20">
                  ★ HOD Overridden
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  ✓ Auto-Verified
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1">
              {selectedAuditLog.subject} • Submitted on{" "}
              <span className="text-white font-medium">
                {selectedAuditLog.rawDate} ({selectedAuditLog.date})
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs font-bold"
          >
            ✕ Close
          </button>
        </div>

        {/* Submitted Answers */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
            <span>🔍</span>
            <span>Submitted Checklist Responses</span>
          </h3>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
            {questionsList.map((q) => {
              const teacherAnswer =
                selectedAuditLog.answers?.[q.id] || "N/A";

              const isYes = teacherAnswer === "Yes";
              const isNo = teacherAnswer === "No";

              return (
                <div
                  key={q.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="text-xs font-medium text-slate-300 flex-1 pr-4">
                    {q.text}
                  </div>

                  <div className="shrink-0">
                    {q.type === "boolean" ? (
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                          isYes
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : isNo
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {isYes ? "✓ YES" : isNo ? "✕ NO" : teacherAnswer}
                      </span>
                    ) : (
                      <span className="text-xs font-mono bg-slate-900 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 block sm:inline italic">
                        "{teacherAnswer}"
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Override Form */}
        <form
          onSubmit={onSubmit}
          className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              HOD Score Override & Audit
            </span>

            <span className="text-xs text-slate-400">
              Current Auto-Score:
              <b className="text-emerald-400 font-mono">
                {" "}
                {selectedAuditLog.score}%
              </b>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Override Score (0 - 100)
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={overrideScore}
                onChange={(e) =>
                  setOverrideScore(Number(e.target.value))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                Verification Status
              </label>

              <select
                value={overrideStatus}
                onChange={(e) => setOverrideStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 outline-none font-semibold"
              >
                <option value="Complete">Complete (Verified)</option>
                <option value="Partial">Partial</option>
                <option value="Overridden">Overridden (Manual Adjust)</option>
                <option value="Rejected">Rejected (Misleading)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              HOD Audit Remark / Explanation
            </label>

            <textarea
              rows={2}
              value={adminAuditNote}
              onChange={(e) => setAdminAuditNote(e.target.value)}
              placeholder="e.g., Verified teacher manual present on desk."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20"
            >
              Save Override & Verify ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}