"use client";

import { Teacher } from "../../data/mockData";

interface DefaultersReportProps {
  selectedDept: string;
  todayRaw: string;
  deptTeachers: Teacher[];
  missingTeachersList: Teacher[];

  onExportPDF: () => void;
  onPingTeacher: (teacher: Teacher) => void;
}

export default function DefaultersReport({
  selectedDept,
  todayRaw,
  deptTeachers,
  missingTeachersList,
  onExportPDF,
  onPingTeacher,
}: DefaultersReportProps) {
  return (
    <div className="bg-slate-900/80 rounded-3xl border border-red-500/30 overflow-hidden shadow-2xl animate-[fadeInUp_0.3s_ease-out_forwards]">
      <div className="p-6 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <span>
              ⚠️ Pending Daily Submissions ({missingTeachersList.length})
            </span>
          </h2>

          <p className="text-xs text-red-300 mt-0.5">
            Faculty members in {selectedDept} who have NOT yet submitted today's
            checklist ({todayRaw}).
          </p>
        </div>

        {missingTeachersList.length > 0 && (
          <button
            onClick={onExportPDF}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg border border-slate-700 transition active:scale-95 flex items-center gap-2"
          >
            <span className="text-base leading-none">📄</span>
            <span>Export PDF Report</span>
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-800/60">
        {missingTeachersList.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              ✓
            </div>

            <h3 className="font-bold text-white text-base">
              100% Compliance Achieved!
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              All {deptTeachers.length} faculty members in {selectedDept} have
              successfully submitted their reports today.
            </p>
          </div>
        ) : (
          missingTeachersList.map((teacher) => (
            <div
              key={teacher.id}
              className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
                  ✕
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">
                      {teacher.name}
                    </span>

                    {teacher.isClassTeacher && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
                        Class Teacher
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">
                    {teacher.subject} •{" "}
                    <span className="text-red-400 font-medium">
                      Status: Not Submitted Today
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onPingTeacher(teacher)}
                className="text-xs font-bold bg-slate-950 hover:bg-red-500/10 text-slate-300 hover:text-red-400 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-red-500/30 transition"
              >
                Ping HOD Reminder 💬
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}