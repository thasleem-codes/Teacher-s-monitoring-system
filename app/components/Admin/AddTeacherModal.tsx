"use client";

import React, { useState } from "react";
import { Teacher } from "../../data/mockData";

interface AddTeacherModalProps {
  isOpen: boolean;
  newTeacherForm: {
    name: string;
    subject: string;
    department: Teacher["department"];
    isClassTeacher: boolean;
    assignedClasses: string;
  };
  setNewTeacherForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      subject: string;
      department: Teacher["department"];
      isClassTeacher: boolean;
      assignedClasses: string;
    }>
  >;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onBulkSubmit: (parsedTeachers: any[]) => Promise<void>; // NEW: Bulk handler
}

export default function AddTeacherModal({
  isOpen,
  newTeacherForm,
  setNewTeacherForm,
  onClose,
  onSubmit,
  onBulkSubmit,
}: AddTeacherModalProps) {
  const [classInput, setClassInput] = useState("");
  const [importMode, setImportMode] = useState<"single" | "bulk">("single");
  const [isParsing, setIsParsing] = useState(false);

  if (!isOpen) return null;

  const classesArray = newTeacherForm.assignedClasses
    ? newTeacherForm.assignedClasses
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  const handleAddClass = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newClass = classInput.trim();
      if (newClass && !classesArray.includes(newClass)) {
        const updatedClasses = [...classesArray, newClass].join(", ");
        setNewTeacherForm({
          ...newTeacherForm,
          assignedClasses: updatedClasses,
        });
      }
      setClassInput("");
    }
  };

  const handleRemoveClass = (classToRemove: string) => {
    const updatedClasses = classesArray
      .filter((c) => c !== classToRemove)
      .join(", ");
    setNewTeacherForm({ ...newTeacherForm, assignedClasses: updatedClasses });
  };

  // NATIVE CSV PARSER
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target?.result as string;
      // Split by new line, remove empty lines
      const lines = text.split("\n").filter((line) => line.trim() !== "");
      const parsedTeachers = [];

      // Start from i = 1 to skip the Header row
      for (let i = 1; i < lines.length; i++) {
        // Handle CSV split (simple comma separation)
        const cols = lines[i].split(",").map((col) => col.trim());
        if (cols.length < 3) continue; // Skip malformed rows

        parsedTeachers.push({
          name: cols[0] || "Unknown",
          subject: cols[1] || "General",
          department: cols[2] || "UP & HS",
          isClassTeacher:
            cols[3]?.toLowerCase() === "yes" ||
            cols[3]?.toLowerCase() === "true",
          // If CSV uses something like "10A | 10B", convert it to standard commas
          assignedClasses: cols[4] ? cols[4].replace(/\|/g, ", ") : "",
        });
      }

      await onBulkSubmit(parsedTeachers);
      setIsParsing(false);
      e.target.value = ""; // Reset input
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl animate-[fadeInUp_0.2s_ease-out_forwards]">
        {/* HEADER & TOGGLE */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black">👨‍🏫 Add Faculty</h2>
          <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => setImportMode("single")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${importMode === "single" ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-white"}`}
            >
              Single
            </button>
            <button
              onClick={() => setImportMode("bulk")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${importMode === "bulk" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"}`}
            >
              CSV Bulk
            </button>
          </div>
        </div>

        {importMode === "single" ? (
          /* ================= SINGLE ENTRY FORM ================= */
          <form
            onSubmit={onSubmit}
            className="space-y-4 animate-[fadeInUp_0.2s_ease-out_forwards]"
          >
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={newTeacherForm.name}
                onChange={(e) =>
                  setNewTeacherForm({ ...newTeacherForm, name: e.target.value })
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

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                Assigned Classes
              </label>
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus-within:border-emerald-500 transition-colors">
                <div className="flex flex-wrap gap-2 mb-2">
                  {classesArray.map((cls, i) => (
                    <span
                      key={i}
                      className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg text-xs flex items-center gap-1.5 font-semibold"
                    >
                      {cls}
                      <button
                        type="button"
                        onClick={() => handleRemoveClass(cls)}
                        className="hover:text-emerald-200 transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  onKeyDown={handleAddClass}
                  placeholder="Type a class (e.g. 10A) and press Enter"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>
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
        ) : (
          /* ================= BULK IMPORT (CSV) ================= */
          <div className="space-y-6 animate-[fadeInUp_0.2s_ease-out_forwards]">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center border-dashed">
              <span className="text-3xl mb-2 block">📊</span>
              <p className="text-sm font-bold text-white mb-1">
                Upload CSV File
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Export your Excel sheet as a .csv file and upload.
              </p>

              <label className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer transition shadow-lg shadow-blue-600/20 inline-block">
                {isParsing ? "Processing..." : "Browse CSV File"}
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isParsing}
                />
              </label>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left">
              <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">
                Required CSV Headers (in order)
              </p>
              <code className="text-xs text-slate-300 block bg-slate-900 p-2 rounded border border-slate-700">
                Name, Subject, Department, IsClassTeacher, Classes
              </code>
              <p className="text-[10px] text-slate-500 mt-2">
                * Department must match exactly: UP & HS, LP, KG, or HSS.
                <br />* Classes should be separated by a pipe symbol ( | ) in
                your excel (e.g., 10A | 10B).
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-700 font-bold py-3 rounded-xl text-xs"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
