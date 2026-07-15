"use client";

import Image from "next/image";

type ActiveTab =
  | "analytics"
  | "defaulters"
  | "submissions"
  | "faculty"
  | "questions"
  | "breakdown";

interface SidebarProps {
  selectedDept: string;
  setSelectedDept: React.Dispatch<React.SetStateAction<string>>;

  activeTab: ActiveTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;

  missingCount: number;

  adminUsername: string;

  onOpenSettings: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  selectedDept,
  setSelectedDept,
  activeTab,
  setActiveTab,
  missingCount,
  adminUsername,
  onOpenSettings,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between p-6 shrink-0 hidden lg:flex sticky top-0 h-dvh z-30">
      <div className="space-y-8">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-sm shrink-0">
            <Image
              src="/kite.png"
              alt="KRHS Logo"
              width={24}
              height={24}
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
            />
          </div>

          <div>
            <span className="font-black text-base tracking-tight block leading-none">
              KRHS<span className="text-emerald-400"> ADMIN</span>
            </span>

            <span className="text-[10px] text-slate-500 font-mono">
              HOD Portal v2.0
            </span>
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
            Department Scope
          </label>

          <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80">
            {["UP & HS", "LP", "KG", "HSS"].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedDept === dept
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">

          <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
            Analytics & Management
          </label>

          <SidebarButton
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
            icon="📊"
          >
            Overview & Charts
          </SidebarButton>

          <button
            onClick={() => setActiveTab("defaulters")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === "defaulters"
                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span>⚠️</span>
              <span>Missing Logs</span>
            </div>

            {missingCount > 0 && (
              <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">
                {missingCount}
              </span>
            )}
          </button>

          <SidebarButton
            active={activeTab === "submissions"}
            onClick={() => setActiveTab("submissions")}
            icon="📋"
          >
            Submissions Report
          </SidebarButton>

          <SidebarButton
            active={activeTab === "questions"}
            onClick={() => setActiveTab("questions")}
            icon="❓"
          >
            Question Studio
          </SidebarButton>

          <SidebarButton
            active={activeTab === "breakdown"}
            onClick={() => setActiveTab("breakdown")}
            icon="🎯"
          >
            Item Breakdown
          </SidebarButton>

          <SidebarButton
            active={activeTab === "faculty"}
            onClick={() => setActiveTab("faculty")}
            icon="👨‍🏫"
          >
            Faculty Directory
          </SidebarButton>

        </nav>
      </div>

      <div className="pt-6 border-t border-slate-800/80 space-y-2">

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
        >
          <span>⚙️</span>
          <span>Account Settings</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition"
        >
          <span>🚪</span>
          <span>Logout System</span>
        </button>

      </div>
    </aside>
  );
}

interface SidebarButtonProps {
  active: boolean;
  icon: string;
  children: React.ReactNode;
  onClick: () => void;
}

function SidebarButton({
  active,
  icon,
  children,
  onClick,
}: SidebarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
        active
          ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/30"
          : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
      }`}
    >
      <span>{icon}</span>
      <span>{children}</span>
    </button>
  );
}