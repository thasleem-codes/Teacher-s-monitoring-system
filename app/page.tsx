import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-slate-100 p-6">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Teacher Monitoring <span className="text-blue-600">System</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Streamline daily reporting, track performance metrics, and automated monthly evaluations.
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Teacher Portal Card */}
          <Link 
            href="/teacher" 
            className="group relative bg-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div>
              <span className="text-4xl mb-4 block">👨‍🏫</span>
              <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                Teacher Portal
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Quick daily activity logging. Select your profile from the dropdown to view your tailored checklist—no password required.
              </p>
            </div>
            <div className="flex items-center text-blue-600 font-semibold text-sm">
              <span>Enter Portal</span>
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>

          {/* Admin Dashboard Card */}
          <Link 
            href="/admin" 
            className="group relative bg-slate-900 text-white p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-800 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-800 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            <div>
              <span className="text-4xl mb-4 block">📊</span>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                Admin Dashboard
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Review submissions, track overall school analytics, and view the automated Best Teacher of the Month rankings.
              </p>
            </div>
            <div className="flex items-center text-blue-400 font-semibold text-sm">
              <span>Access Dashboard</span>
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}