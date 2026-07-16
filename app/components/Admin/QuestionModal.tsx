"use client";

import React from "react";

// Extending the base type to include our new dynamic features
interface DynamicQuestionForm {
  text: string;
  type: string;
  group: string;
  points: number;
  day: string;
  scale_limit?: number;
  custom_options?: string[];
}

interface QuestionModalProps {
  isOpen: boolean;
  editingQuestionId: string | null;
  questionForm: DynamicQuestionForm;
  setQuestionForm: React.Dispatch<React.SetStateAction<any>>;
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

        <form onSubmit={onSubmit} className="space-y-5">
          {/* QUESTION TEXT */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
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
              placeholder="e.g., Do you get substitution period today?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* RESPONSE TYPE DROPDOWN */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Response Format
              </label>
              <select
                value={questionForm.type}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    type: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:border-emerald-500 outline-none font-semibold transition-colors cursor-pointer"
              >
                <option value="boolean">Simple Yes / No</option>
                <option value="boolean_with_text">
                  Yes/No + Text Box (e.g., Birthdays)
                </option>
                <option value="class_select">
                  Yes/No + Select Classes (e.g., Notebooks)
                </option>
                <option value="scale">
                  Numeric Scale (e.g., Substitutions)
                </option>
                <option value="multiple_choice">
                  Custom Multiple Choice Options
                </option>
                <option value="text">Paragraph / Explanation</option>
              </select>
            </div>

            {/* TARGET GROUP */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Group
              </label>
              <select
                value={questionForm.group}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    group: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:border-emerald-500 outline-none font-semibold transition-colors cursor-pointer"
              >
                <option value="common">Common (All Teachers)</option>
                <option value="class_teacher">Class Teachers Only</option>
              </select>
            </div>
          </div>

          {/* ========================================= */}
          {/* DYNAMIC SETTINGS BASED ON SELECTED TYPE   */}
          {/* ========================================= */}

          {questionForm.type === "scale" && (
            <div className="bg-slate-950/50 p-4 rounded-xl border border-emerald-500/30 animate-[fadeInUp_0.2s_ease-out_forwards]">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
                Set Maximum Limit (Scale)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={questionForm.scale_limit || 5}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    scale_limit: Number(e.target.value),
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-emerald-500 outline-none font-mono"
                placeholder="e.g., 5"
              />
              <p className="text-[10px] text-slate-500 mt-2">
                Generates a row of buttons from <b>Nil</b> up to your limit.
              </p>
            </div>
          )}

          {questionForm.type === "multiple_choice" && (
            <div className="bg-slate-950/50 p-4 rounded-xl border border-emerald-500/30 animate-[fadeInUp_0.2s_ease-out_forwards]">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Custom Options (Press Enter to add)
              </label>

              <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 focus-within:border-emerald-500 transition-colors">
                {/* Display as Chips */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.isArray(questionForm.custom_options) &&
                    questionForm.custom_options.map((opt, i) => (
                      <span
                        key={i}
                        className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-lg text-xs flex items-center gap-1.5 font-semibold"
                      >
                        {opt}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = questionForm.custom_options!.filter(
                              (_, idx) => idx !== i,
                            );
                            setQuestionForm({
                              ...questionForm,
                              custom_options: updated,
                            });
                          }}
                          className="hover:text-emerald-200"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                </div>

                {/* Input Field */}
                <input
                  type="text"
                  placeholder="Type option and press Enter"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        setQuestionForm({
                          ...questionForm,
                          custom_options: [
                            ...(questionForm.custom_options || []),
                            val,
                          ],
                        });
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-2">
                Type each option and press Enter to save it.
              </p>
            </div>
          )}

          {/* ========================================= */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
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
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:border-emerald-500 outline-none font-mono transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Schedule Day Trigger
              </label>
              <select
                value={questionForm.day}
                onChange={(e) =>
                  setQuestionForm({
                    ...questionForm,
                    day: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:border-emerald-500 outline-none font-semibold transition-colors cursor-pointer"
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

          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl text-xs transition-colors active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              Save Question ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
