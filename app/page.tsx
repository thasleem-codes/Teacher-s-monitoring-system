import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col justify-between bg-slate-950 text-white overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* 1. SUBTLE ARCHITECTURAL GRID BACKGROUND (Matches your reference image exactly) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/15 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* 2. TOP NAVIGATION BAR (Admin Login moved here!) */}
      <header className="w-full border-b border-slate-900/80 backdrop-blur-md bg-slate-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
              <img src="/kite.png" alt="KRHS International logo mark in blue and indigo gradient representing a modern school brand" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              KRHS<span className="text-blue-400"> INTERNATIONAL</span>
            </span>
          </div>

          {/* Center Navigation (Optional contextual links) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <span className="text-white">Daily Logging</span>
            <span>Evaluation Criteria</span>
            <span>Best Teacher Awards</span>
          </nav>

          {/* ADMIN LOGIN LINK (Top Right - Exact layout as reference image) */}
          <Link
            href="/admin"
            className="group flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-4 py-2.5 rounded-xl transition duration-200 active:scale-95 shadow-sm"
          >
            <span>Admin Login</span>
            <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </Link>
        </div>
      </header>

      {/* 3. MAIN HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Column: Bold Typography & Teacher CTA (7 Columns) */}
        <div className="lg:col-span-7 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Academic Evaluation System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 text-white leading-[1.1]">
            Streamlined daily reporting for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">
              modern educators.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mb-8 leading-relaxed">
            Submit your daily classroom updates, track student engagement educating the next generation.
          </p>

          {/* SINGLE PRIMARY CALL TO ACTION (No confusing second card) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/teacher"
              className="bg-blue-600 hover:bg-blue-500 text-white text-center font-bold px-8 py-4 rounded-xl transition duration-200 shadow-xl shadow-blue-600/25 flex items-center justify-center gap-3 text-base active:scale-[0.98]"
            >
              <span>Enter Teacher Portal</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Staggered Visual UI Cards (5 Columns - Replaces photo grid) */}
        <div className="lg:col-span-5 relative hidden sm:block">
          <div className="relative mx-auto max-w-md h-[420px] flex items-center justify-center">
            {/* Background Decorative Glow behind cards */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-3xl blur-2xl -z-10" />

            {/* Card 1: Top Right - Monthly Award Widget */}
            <div className="absolute top-4 right-2 w-64 bg-slate-900/90 border border-slate-800/80 p-5 rounded-2xl shadow-2xl backdrop-blur-md transform rotate-3 hover:rotate-0 transition duration-300 z-20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl shrink-0">
                  🏆
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Best Teacher Award
                  </div>
                  <div className="text-[10px] text-amber-400 font-semibold">
                    Monthly Automated Score
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-300 w-[88%] h-full rounded-full" />
              </div>
            </div>

            {/* Card 2: Center Left - Daily Checklist Widget */}
            <div className="absolute top-32 left-0 w-72 bg-slate-900/95 border border-slate-750 p-6 rounded-2xl shadow-2xl backdrop-blur-md transform -rotate-2 hover:rotate-0 transition duration-300 z-30">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                  Daily Log Active
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Attendance Registry Updated</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Teacher Manual Submitted</span>
                </div>
              </div>
            </div>

            {/* Card 3: Bottom Right - Class Teacher Badge */}
            {/* Card 3: Bottom Right - Class Teacher Badge */}
            <div className="absolute bottom-6 right-6 w-60 bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-md transform rotate-2 hover:rotate-0 transition duration-300 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
                  CT
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-200 truncate">
                    Faculty Directory
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Role-Based Access • Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SIMPLE FOOTER */}
      <footer className="w-full border-t border-slate-900/80 py-6 text-center text-xs text-slate-600">
        EduMonitor System • Designed for quick & seamless daily activity
        logging.
      </footer>
    </main>
  );
}
