import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-dvh flex flex-col justify-between bg-slate-950 text-white overflow-hidden selection:bg-emerald-600 selection:text-white">
      
      {/* 1. SUBTLE ARCHITECTURAL GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />

      {/* Ambient Glowing Orbs with slow breathing pulse */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-10 right-10 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-teal-500/15 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse duration-[8000ms]" />

      {/* 2. TOP NAVIGATION BAR */}
      <header className="w-full border-b border-slate-900/80 backdrop-blur-md bg-slate-950/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-lg shadow-md shadow-emerald-500/20 hover:scale-105 transition-transform duration-300">
              <img 
                src="/kite.png" 
                alt="KRHS International logo mark in green and teal gradient representing a modern school brand" 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white">
              KRHS<span className="text-emerald-400"> INTERNATIONAL</span>
            </span>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <span className="text-white hover:text-emerald-400 transition-colors cursor-pointer">Daily Logging</span>
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">Evaluation Criteria</span>
            <span className="hover:text-emerald-400 transition-colors cursor-pointer">Best Teacher Awards</span>
          </nav>

          {/* ADMIN LOGIN LINK */}
          <Link
            href="/admin"
            className="group flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition duration-200 active:scale-95 shadow-sm"
          >
            <span>Admin Login</span>
            <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </header>

      {/* 3. MAIN HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 md:py-20 my-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        
        {/* Left Column: Animated Entry Typography & CTA */}
        <div className="lg:col-span-7 text-left animate-[fadeInUp_0.8s_ease-out_forwards]">
          
          {/* Badge with animated radar ping dot */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 sm:mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Academic Evaluation System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 sm:mb-6 text-white leading-[1.15] sm:leading-[1.1]">
            Streamlined daily reporting for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-white">
              modern educators.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-xl mb-6 sm:mb-8 leading-relaxed">
            Submit your daily classroom updates, track student engagement educating the next generation.
          </p>

          {/* PRIMARY CALL TO ACTION with interactive hover glow */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/teacher"
              className="group relative inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all duration-300 shadow-xl shadow-emerald-600/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] text-sm sm:text-base"
            >
              <span>Enter Teacher Portal</span>
              <span className="ml-3 group-hover:translate-x-1.5 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Floating Visual UI Cards */}
        <div className="lg:col-span-5 relative hidden sm:block">
          <div className="relative mx-auto max-w-md h-[420px] flex items-center justify-center">
            
            {/* Background Decorative Glow behind cards */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-teal-600/20 rounded-3xl blur-2xl -z-10" />

            {/* Card 1: Top Right - Monthly Award Widget (Floats every 6 seconds) */}
            <div className="absolute top-4 right-2 z-20 animate-[float_6s_ease-in-out_infinite]">
              <div className="w-64 bg-slate-900/90 border border-slate-800/80 p-5 rounded-2xl shadow-2xl backdrop-blur-md transform rotate-3 hover:rotate-0 transition duration-300 hover:border-emerald-500/40">
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
            </div>

            {/* Card 2: Center Left - Daily Checklist Widget (Floats every 5 seconds with a delay) */}
            <div className="absolute top-32 left-0 z-30 animate-[float_5s_ease-in-out_1s_infinite]">
              <div className="w-72 bg-slate-900/95 border border-slate-750 p-6 rounded-2xl shadow-2xl backdrop-blur-md transform -rotate-2 hover:rotate-0 transition duration-300 hover:border-emerald-500/40">
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
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
            </div>

            {/* Card 3: Bottom Right - Faculty Directory Badge (Floats every 7 seconds) */}
            <div className="absolute bottom-6 right-6 z-10 animate-[float_7s_ease-in-out_0.5s_infinite]">
              <div className="w-60 bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-md transform rotate-2 hover:rotate-0 transition duration-300 hover:border-teal-500/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-xs shrink-0">
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
      </div>

      {/* 4. FOOTER WITH CUSTOM BRANDING */}
      <footer className="w-full border-t border-slate-900/80 py-3 sm:py-5 px-4 text-center text-xs text-slate-500 z-10">
        <p>EduMonitor System • Designed for quick & seamless daily activity logging.</p>
        <p className="mt-1 text-slate-400 font-medium tracking-wide">
          Powered by <span className="text-emerald-400 font-semibold">Code Craft</span> | 6282811230
        </p>
      </footer>

      {/* 5. INJECTED CUSTOM ANIMATION KEYFRAMES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />

    </main>
  );
}