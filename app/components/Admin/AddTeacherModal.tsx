"use client";

import React from "react";
import { Teacher } from "../../data/mockData";

interface AddTeacherModalProps {
  isOpen: boolean;

  newTeacherForm: {
    name: string;
    subject: string;
    department: Teacher["department"];
    isClassTeacher: boolean;
  };

  setNewTeacherForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      subject: string;
      department: Teacher["department"];
      isClassTeacher: boolean;
    }>
  >;

  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddTeacherModal({
  isOpen,
  newTeacherForm,
  setNewTeacherForm,
  onClose,
  onSubmit,
}: AddTeacherModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl animate-[fadeInUp_0.2s_ease-out_forwards]">

        <h2 className="text-lg font-black mb-1">
          👨‍🏫 Add Faculty Member
        </h2>

        <p className="text-xs text-slate-400 mb-6">
          Add a new teacher to the directory for evaluation.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Full Name
            </label>

            <input
              type="text"
              value={newTeacherForm.name}
              onChange={(e) =>
                setNewTeacherForm({
                  ...newTeacherForm,
                  name: e.target.value,
                })
              }
              placeholder="e.g. Priya Nair"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Subject Taught
            </label>

            <input
              type="text"
              value={newTeacherForm.subject}
              onChange={(e) =>
                setNewTeacherForm({
                  ...newTeacherForm,
                  subject: e.target.value,
                })
              }
              placeholder="e.g. Social Studies"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
              Department
            </label>

            <select
              value={newTeacherForm.department}
              onChange={(e) =>
                setNewTeacherForm({
                  ...newTeacherForm,
                  department: e.target.value as Teacher["department"],
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
            >
              <option value="UP & HS">UP & HS</option>
              <option value="LP">LP</option>
              <option value="KG">KG</option>
              <option value="HSS">HSS</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-2 bg-slate-950 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              checked={newTeacherForm.isClassTeacher}
              onChange={(e) =>
                setNewTeacherForm({
                  ...newTeacherForm,
                  isClassTeacher: e.target.checked,
                })
              }
              className="w-4 h-4 text-emerald-600 rounded"
            />

            <span className="text-xs font-bold text-slate-300">
              Assign as Class Teacher
            </span>
          </label>

          <div className="flex gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 font-bold py-3 rounded-xl text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20"
            >
              + Add Teacher
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}