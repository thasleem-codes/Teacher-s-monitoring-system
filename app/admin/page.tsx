'use client';

import { useState } from 'react';
import Link from 'next/link';
import { initialTeachers, initialSubmissions, initialLeaderboard, Teacher, TeacherRanking, DailyLogSubmission } from '../data/mockData';

export default function AdminDashboard() {
  // 1. Authentication & Credentials State (Requirement 3)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<boolean>(false);
  
  // Mutable Admin Credentials
  const [adminCreds, setAdminCreds] = useState({ username: 'admin', password: 'admin123' });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('admin');
  const [newPassword, setNewPassword] = useState<string>('admin123');

  // 2. Interactive Data States (Requirement 1)
  const [teachersList, setTeachersList] = useState<Teacher[]>(initialTeachers);
  const [submissionsList] = useState<DailyLogSubmission[]>(initialSubmissions);
  const [leaderboardList] = useState<TeacherRanking[]>(initialLeaderboard);

  // 3. Dashboard Filter & Tab State (Requirement 2)
  const [selectedDept, setSelectedDept] = useState<string>('UP & HS');
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'faculty'>('overview');

  // New Teacher Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTeacherForm, setNewTeacherForm] = useState({ name: '', subject: '', department: 'UP & HS' as any, isClassTeacher: false });

  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((usernameInput === adminCreds.username || usernameInput === 'admin') && passwordInput === adminCreds.password) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  // REQUIREMENT 1: Add New Teacher Logic
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const newT: Teacher = {
      id: `t_${Date.now()}`,
      name: newTeacherForm.name,
      subject: newTeacherForm.subject,
      department: newTeacherForm.department,
      isClassTeacher: newTeacherForm.isClassTeacher
    };
    setTeachersList([newT, ...teachersList]);
    setIsAddModalOpen(false);
    setNewTeacherForm({ name: '', subject: '', department: 'UP & HS', isClassTeacher: false });
  };

  // REQUIREMENT 1: Delete Teacher Logic
  const handleDeleteTeacher = (id: string) => {
    if (confirm('Are you sure you want to remove this faculty member?')) {
      setTeachersList(teachersList.filter(t => t.id !== id));
    }
  };

  // REQUIREMENT 3: Save New Credentials
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCreds({ username: newUsername, password: newPassword });
    setIsSettingsOpen(false);
    alert('✅ Admin credentials updated successfully!');
  };

  // REQUIREMENT 2: Dynamic Filtering by Department
  const filteredTeachers = teachersList.filter(t => t.department === selectedDept);
  const filteredLeaderboard = leaderboardList.filter(l => l.department === selectedDept);
  const filteredSubmissions = submissionsList.filter(s => s.department === selectedDept);

  // ==========================================
  // SCREEN 1: LOGIN GATEWAY
  // ==========================================
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-dvh flex flex-col justify-between bg-slate-950 text-white overflow-hidden p-6 selection:bg-emerald-600">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/15 to-amber-500/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

        <header className="w-full max-w-md mx-auto flex items-center justify-between py-4 border-b border-slate-900/80 z-10">
          <div className="flex items-center gap-2.5">
            <img src="/kite.png" alt="KRHS Logo" className="w-7 h-7 object-contain" />
            <span className="font-bold text-sm tracking-tight text-white">KRHS<span className="text-emerald-400"> ADMIN</span></span>
          </div>
          <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">← Back to Home</Link>
        </header>

        <div className="max-w-md w-full my-auto mx-auto relative z-10">
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 mx-auto rounded-t-full shadow-lg shadow-amber-500/30 mb-[-1px] relative z-20" />
          <div className="bg-slate-900/90 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">🔒 Restricted Access</span>
              <span className="text-xs font-mono text-slate-500">HOD Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">Admin Gateway</h1>
            <p className="text-xs text-slate-400 mb-6">Enter authorization credentials to access evaluations.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => { setUsernameInput(e.target.value); setLoginError(false); }}
                  placeholder="Username..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
                  <span className="text-[10px] text-emerald-400 font-mono">Hint: {adminCreds.username} / {adminCreds.password}</span>
                </div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setLoginError(false); }}
                  placeholder="Password..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>
              {loginError && <p className="text-red-400 text-xs mt-2 animate-pulse">⚠️ Incorrect username or password.</p>}
              <button type="submit" className="w-full font-bold py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white shadow-xl shadow-emerald-600/20 transition-all text-sm">Unlock Command Center →</button>
            </form>
          </div>
        </div>
        <footer className="w-full text-center py-4 text-xs text-slate-500">Designed by <span className="text-emerald-400 font-semibold">Code Craft</span> | 6282811230</footer>
      </main>
    );
  }

  // ==========================================
  // SCREEN 2: MAIN DASHBOARD
  // ==========================================
  return (
    <main className="min-h-dvh flex flex-col justify-between bg-slate-950 text-white selection:bg-emerald-600 pb-10">
      
      {/* Settings Modal (Requirement 3) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl animate-[fadeInUp_0.2s_ease-out_forwards]">
            <h2 className="text-lg font-black text-white mb-1">⚙️ Update Account Settings</h2>
            <p className="text-xs text-slate-400 mb-6">Change your administrator username and password.</p>
            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">New Username</label>
                <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">New Password</label>
                <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none font-mono" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsSettingsOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Teacher Modal (Requirement 1) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl animate-[fadeInUp_0.2s_ease-out_forwards]">
            <h2 className="text-lg font-black text-white mb-1">👨‍🏫 Add Faculty Member</h2>
            <p className="text-xs text-slate-400 mb-6">Add a new teacher to the directory for evaluation.</p>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name</label>
                <input type="text" value={newTeacherForm.name} onChange={e => setNewTeacherForm({...newTeacherForm, name: e.target.value})} placeholder="e.g. Priya Nair" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Subject Taught</label>
                <input type="text" value={newTeacherForm.subject} onChange={e => setNewTeacherForm({...newTeacherForm, subject: e.target.value})} placeholder="e.g. Social Studies" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Department</label>
                <select value={newTeacherForm.department} onChange={e => setNewTeacherForm({...newTeacherForm, department: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none">
                  <option value="UP & HS">UP & HS</option>
                  <option value="LP">LP</option>
                  <option value="KG">KG</option>
                  <option value="HSS">HSS</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-2 bg-slate-950 rounded-xl border border-slate-800">
                <input type="checkbox" checked={newTeacherForm.isClassTeacher} onChange={e => setNewTeacherForm({...newTeacherForm, isClassTeacher: e.target.checked})} className="w-4 h-4 text-emerald-600 rounded" />
                <span className="text-xs font-bold text-slate-300">Assign as Class Teacher (Enables special registry questions)</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20">+ Add Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/kite.png" alt="KRHS Logo" className="w-8 h-8 object-contain" />
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight text-white block leading-none">KRHS<span className="text-emerald-400"> EVALUATION</span></span>
              <span className="text-[10px] text-slate-400 font-mono">HOD Analytics Engine</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setIsSettingsOpen(true)} className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-1.5">
              <span>⚙️ Settings</span>
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs font-semibold bg-slate-900 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-slate-800 px-3 py-2 rounded-xl transition">Logout ✕</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8 animate-[fadeInUp_0.4s_ease-out_forwards]">
        
        {/* REQUIREMENT 2: Department Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Department Overview</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Showing live evaluation metrics strictly for <span className="text-emerald-400 font-bold">{selectedDept}</span> department.</p>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-3 pr-1">Filter Dept:</span>
            {['UP & HS', 'LP', 'KG', 'HSS'].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDept === dept ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
            <div className="text-slate-400 text-xs font-bold uppercase mb-1">Active Faculty</div>
            <div className="text-3xl font-black text-white">{filteredTeachers.length} <span className="text-xs text-emerald-400 font-normal">in {selectedDept}</span></div>
          </div>
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
            <div className="text-slate-400 text-xs font-bold uppercase mb-1">Today's Logs</div>
            <div className="text-3xl font-black text-white">{filteredSubmissions.length} <span className="text-xs text-emerald-400 font-normal">Submitted</span></div>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 rounded-3xl border border-amber-500/30">
            <div className="text-amber-400 text-xs font-bold uppercase mb-1 flex items-center gap-1.5"><span>👑</span><span>Dept Leader</span></div>
            <div className="text-2xl font-black text-white truncate">{filteredLeaderboard[0]?.name || 'No Data'}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-900 pb-2">
          <button onClick={() => setActiveTab('overview')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'overview' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}>🏆 Best Teacher Leaderboard</button>
          <button onClick={() => setActiveTab('submissions')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'submissions' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}>📋 Live Submissions ({filteredSubmissions.length})</button>
          <button onClick={() => setActiveTab('faculty')} className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'faculty' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}>👨‍🏫 Faculty Directory ({filteredTeachers.length})</button>
        </div>

        {/* TAB 1: LEADERBOARD */}
        {activeTab === 'overview' && (
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white">{selectedDept} Evaluation Rankings</h2>
                <p className="text-xs text-slate-400">Filtered leaderboard for the selected department.</p>
              </div>
            </div>
            <div className="divide-y divide-slate-800/60">
              {filteredLeaderboard.length === 0 ? (
                <p className="p-8 text-center text-slate-500 text-sm">No ranking data available for {selectedDept} department.</p>
              ) : (
                filteredLeaderboard.map((teacher) => (
                  <div key={teacher.teacherId} className="p-5 sm:p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shrink-0 ${teacher.rank === 1 ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-200'}`}>
                        {teacher.rank === 1 ? '👑' : `#${teacher.rank}`}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{teacher.name}</h3>
                        <p className="text-xs text-slate-400">{teacher.subject} • <span className="text-emerald-400 font-semibold">{teacher.department}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-mono">Score</div>
                      <div className="text-xl font-black text-white">{teacher.monthlyScore} / 100</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800/80">
              <h2 className="text-lg font-black text-white">{selectedDept} Daily Reports</h2>
              <p className="text-xs text-slate-400">End-of-day checklist submissions.</p>
            </div>
            <div className="divide-y divide-slate-800/60">
              {filteredSubmissions.length === 0 ? (
                <p className="p-8 text-center text-slate-500 text-sm">No submissions recorded today for {selectedDept}.</p>
              ) : (
                filteredSubmissions.map((log) => (
                  <div key={log.id} className="p-5 sm:p-6 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.teacherName}</span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">{log.status}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{log.subject} • {log.date}</p>
                    </div>
                    <div className="text-base font-black text-emerald-400">{log.score}%</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* REQUIREMENT 1: TAB 3: FACULTY DIRECTORY (CRUD) */}
        {activeTab === 'faculty' && (
          <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-800/80 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-black text-white">{selectedDept} Staff Directory</h2>
                <p className="text-xs text-slate-400">Add, edit, or remove faculty members from this department.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <span>+ Add New Teacher</span>
              </button>
            </div>

            <div className="divide-y divide-slate-800/60">
              {filteredTeachers.length === 0 ? (
                <p className="p-8 text-center text-slate-500 text-sm">No teachers found in {selectedDept} department. Click Add New Teacher above!</p>
              ) : (
                filteredTeachers.map((t) => (
                  <div key={t.id} className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">👤</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{t.name}</span>
                          {t.isClassTeacher && <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">Class Teacher</span>}
                        </div>
                        <p className="text-xs text-slate-400">{t.subject} • <span className="text-emerald-400 font-semibold">{t.department}</span></p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTeacher(t.id)}
                      className="text-xs font-bold bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 px-3 py-2 rounded-xl border border-slate-800 hover:border-red-500/30 transition"
                    >
                      Remove ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      <footer className="w-full text-center py-6 mt-auto text-xs text-slate-500 border-t border-slate-900">
        <p>EduMonitor System • HOD Evaluation Engine</p>
        <p className="mt-1 text-slate-400 font-medium tracking-wide">Designed by <span className="text-emerald-400 font-semibold">Code Craft</span> | 6282811230</p>
      </footer>
    </main>
  );
}