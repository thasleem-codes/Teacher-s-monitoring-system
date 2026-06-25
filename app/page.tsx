import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden p-6 sm:p-8">
      
      {/* 1. ENGAGING BACKGROUND GRAPHICS */}
      {/* Modern Architectural Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
      
      {/* Floating Glowing Gradient Orbs for Visual Depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-tr from-blue-600/30 via-indigo-600/30 to-purple-600/30 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[250px] h-[250px] bg-sky-500/20 blur-[80px] rounded-full pointer-events-none -z-10" />

      {/* Main Content Container */}
      <div className="max-w-3xl w-full my-auto py-8 z-10">
        
        {/* Header Section (Cleaned of developer jargon) */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium uppercase tracking-widest mb-4 shadow-inner">
            Academic Year 2026–2027
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4 text-white">
            Teacher Monitoring <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">System</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
            Select your destination portal below to continue.
          </p>
        </div>

        {/* 2. PUNCHY, NO-DESCRIPTION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl mx-auto">
          
          {/* Teacher Portal Card */}
          <Link 
            href="/teacher" 
            className="group relative bg-slate-900/80 hover:bg-slate-800/90 p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-md active:scale-[0.98] cursor-pointer overflow-hidden"
          >
            {/* Subtle Top Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                👨‍🏫
              </div>
              
              <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
                No Password
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                Teacher Portal
              </h2>
              <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center text-slate-300 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                →
              </div>
            </div>
          </Link>

          {/* Admin Dashboard Card */}
          <Link 
            href="/admin" 
            className="group relative bg-slate-900/80 hover:bg-slate-800/90 p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-md active:scale-[0.98] cursor-pointer overflow-hidden"
          >
            {/* Subtle Top Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                📊
              </div>
              
              <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
                Secured
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
              <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                Admin Dashboard
              </h2>
              <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center text-slate-300 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                →
              </div>
            </div>
          </Link>

        </div>
      </div>
      
      {/* Subtle Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-600 mt-auto z-10">
        System Active • Ready for Submissions
      </footer>
    </main>
  );
}