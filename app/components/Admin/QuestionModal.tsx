"use client";

import React from "react";
import { Question } from "../../data/mockData";

interface QuestionModalProps {
  isOpen: boolean;
  editingQuestionId: string | null;

  questionForm: Omit<Question, "id">;

  setQuestionForm: React.Dispatch<
    React.SetStateAction<Omit<Question, "id">>
  >;

  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function QuestionModal({
  isOpen,
  editingQuestionId,
  questionForm,
  setQuestionForm,
  onClose,
  onSubmit,
}: QuestionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl animate-[fadeInUp_0.2s_ease-out_forwards]">
        <h2 className="text-lg font-black text-white mb-1">
          {editingQuestionId
            ? "✏️ Edit Checklist Question"
            : "❓ Add New Checklist Question"}
        </h2>

        <p className="text-xs text-slate-400 mb-6">
          Configure question type, target audience, points, and day triggers.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
              Question Text
            </label>

            <input
              type="text"
              value={questionForm.text}
              onChange={(e) =>
                setQuestionForm({
                  ...questionForm,
                  text: e.target.value,
                })
              }
              placeholder="e.g., Did you complete lesson plan evaluation?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Response Type
              </label>

              <select
                value={questionForm.type}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    type: e.target.value as Question["type"],
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none font-semibold"
              >
                <option value="boolean">
                  Yes / No (Task Boolean)
                </option>

                <option value="text">
                  Text Remark / Explanation
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Target Group
              </label>

              <select
                value={questionForm.group}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    group: e.target.value as Question["group"],
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none font-semibold"
              >
                <option value="common">
                  Common (All Teachers)
                </option>

                <option value="class_teacher">
                  Class Teachers Only
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Points Weightage
              </label>

              <input
                type="number"
                min="0"
                max="100"
                value={questionForm.points}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    points: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Schedule Day Trigger
              </label>

              <select
                value={questionForm.day}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    day: e.target.value as Question["day"],
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none font-semibold"
              >
                <option value="Everyday">Everyday (All Week)</option>
                <option value="Monday">Monday Only</option>
                <option value="Tuesday">Tuesday Only</option>
                <option value="Wednesday">Wednesday Only</option>
                <option value="Thursday">Thursday Only</option>
                <option value="Friday">Friday Only</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20"
            >
              Save Question ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}