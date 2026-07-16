"use client";

import { Teacher } from "../../data/mockData";

interface FacultyDirectoryProps {
  selectedDept: string;
  deptTeachers: Teacher[];

  onAddTeacher: () => void;
  onEditTeacher: (teacher: Teacher) => void; // <-- ADDED THIS
  onDeleteTeacher: (teacher: Teacher) => void;
}

export default function FacultyDirectory({
  selectedDept,
  deptTeachers,
  onAddTeacher,
  onEditTeacher, // <-- ADDED THIS
  onDeleteTeacher,
}: FacultyDirectoryProps) {
  return (
    <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl animate-[fadeInUp_0.3s_ease-out_forwards]">
      <div className="p-6 border-b border-slate-800/80 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-black text-white">
            {selectedDept} Staff Directory
          </h2>

          <p className="text-xs text-slate-400">
            Manage active faculty members.
          </p>
        </div>

        <button
          onClick={onAddTeacher}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition"
        >
          + Add New Teacher
        </button>
      </div>

      <div className="divide-y divide-slate-800/60">
        {deptTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                👤
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
                  <span className="text-emerald-400 font-semibold">
                    {teacher.department}
                  </span>
                </p>
              </div>
            </div>

            {/* NEW: Action Buttons Container */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => onEditTeacher(teacher)}
                className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 transition"
              >
                Edit ✏️
              </button>
              <button
                onClick={() => onDeleteTeacher(teacher)}
                className="text-xs font-bold bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 px-3 py-2 rounded-xl border border-slate-800 hover:border-red-500/30 transition"
              >
                Remove ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
