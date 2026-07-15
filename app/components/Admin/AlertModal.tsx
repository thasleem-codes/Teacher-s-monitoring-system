"use client";

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
  onClose: () => void;
}

export default function AlertModal({
  isOpen,
  title,
  message,
  type,
  onClose,
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center animate-[fadeInUp_0.2s_ease-out_forwards]">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner ${
            type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : type === "warning"
              ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
              : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
          }`}
        >
          {type === "success"
            ? "✓"
            : type === "warning"
            ? "⚠️"
            : "ℹ️"}
        </div>

        <h3 className="text-lg font-black text-white mb-2">
          {title}
        </h3>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition active:scale-[0.98]"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}