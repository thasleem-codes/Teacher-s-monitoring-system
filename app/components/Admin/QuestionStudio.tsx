"use client";

import { Question } from "../../data/mockData";

interface QuestionStudioProps {
  questionsList: Question[];

  onAddQuestion: () => void;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
}

export default function QuestionStudio({
  questionsList,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: QuestionStudioProps) {
  return (
    <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl animate-[fadeInUp_0.3s_ease-out_forwards]">
      <div className="p-6 border-b border-slate-800/80 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-black text-white">
            ❓ Evaluation Question Studio
          </h2>

          <p className="text-xs text-slate-400">
            Add, edit, or delete questions presented on the daily teacher
            checklist.
          </p>
        </div>

        <button
          onClick={onAddQuestion}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition"
        >
          + Add New Question
        </button>
      </div>

      <div className="divide-y divide-slate-800/60">
        {questionsList.map((question, index) => (
          <div
            key={question.id}
            className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
          >
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {index + 1}
              </span>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-white text-base">
                    {question.text}
                  </span>

                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700 uppercase">
                    {question.type}
                  </span>

                  {question.group === "class_teacher" ? (
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                      Class Teacher Only
                    </span>
                  ) : (
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                      Common
                    </span>
                  )}

                  {question.day && question.day !== "Everyday" && (
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded-full border border-purple-500/20">
                      📅 {question.day}s Only
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  Weightage Value:{" "}
                  <span className="text-emerald-400 font-mono font-bold">
                    {question.points} Points
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => onEditQuestion(question)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700"
              >
                Edit ✏️
              </button>

              <button
                onClick={() => onDeleteQuestion(question.id)}
                className="bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 px-3 py-2 rounded-xl text-xs font-bold border border-slate-800 hover:border-red-500/30"
              >
                Delete ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}