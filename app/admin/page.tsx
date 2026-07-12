'use client';

import { useState } from 'react';
import Link from 'next/link';
import { initialTeachers, initialSubmissions, initialLeaderboard, mockQuestions, Teacher, TeacherRanking, DailyLogSubmission } from '../data/mockData';

// NEW: TypeScript interface for our Custom Alert Box
interface AlertModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
}

export default function AdminDashboard() {
  // Auth & Settings State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<boolean>(false);
  const [adminCreds, setAdminCreds] = useState({ username: 'admin', password: 'admin123' });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('admin');
  const [newPassword, setNewPassword] = useState<string>('admin123');

  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState<'analytics' | 'defaulters' | 'submissions' | 'faculty'>('analytics');
  const [selectedDept, setSelectedDept] = useState<string>('UP & HS');
  const [timeRange, setTimeRange] = useState<'today' | 'month' | 'custom'>('today');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-07-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-07-12');

  // Data Lists
  const [teachersList, setTeachersList] = useState<Teacher[]>(initialTeachers);
  const [submissionsList, setSubmissionsList] = useState<DailyLogSubmission[]>(initialSubmissions);
  const [leaderboardList] = useState<TeacherRanking[]>(initialLeaderboard);

  // Add Faculty Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTeacherForm, setNewTeacherForm] = useState({ name: '', subject: '', department: 'UP & HS' as any, isClassTeacher: false });

  // Audit & Override Modal State
  const [selectedAuditLog, setSelectedAuditLog] = useState<DailyLogSubmission | null>(null);
  const [overrideScore, setOverrideScore] = useState<number>(100);
  const [overrideStatus, setOverrideStatus] = useState<any>('Complete');
  const [adminAuditNote, setAdminAuditNote] = useState<string>('');

  // =================================================================
  // REQUIREMENT 2: CUSTOM TAILWIND ALERT BOX STATE
  // =================================================================
  const [customAlert, setCustomAlert] = useState<AlertModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const triggerAlert = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setCustomAlert({ isOpen: true, title, message, type });
  };

  const todayRaw = '2026-07-12';
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

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const newT: Teacher = { id: `t_${Date.now()}`, name: newTeacherForm.name, subject: newTeacherForm.subject, department: newTeacherForm.department, isClassTeacher: newTeacherForm.isClassTeacher };
    setTeachersList([newT, ...teachersList]);
    setIsAddModalOpen(false);
    setNewTeacherForm({ name: '', subject: '', department: 'UP & HS', isClassTeacher: false });
    triggerAlert('Faculty Added', `${newT.name} has been successfully added to the ${newT.department} directory.`, 'success');
  };

  const handleDeleteTeacher = (t: Teacher) => {
    setTeachersList(teachersList.filter(item => item.id !== t.id));
    triggerAlert('Faculty Removed', `${t.name} has been removed from the system.`, 'warning');
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCreds({ username: newUsername, password: newPassword });
    setIsSettingsOpen(false);
    triggerAlert('Settings Updated', 'Admin credentials have been successfully updated!', 'success');
  };

  const handleOpenAuditModal = (log: DailyLogSubmission) => {
    setSelectedAuditLog(log);
    setOverrideScore(log.score);
    setOverrideStatus(log.status);
    setAdminAuditNote(log.adminNotes || '');
  };

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuditLog) return;

    const updatedSubmissions = submissionsList.map((item) => {
      if (item.id === selectedAuditLog.id) {
        return {
          ...item,
          score: Number(overrideScore),
          status: overrideStatus,
          isOverridden: true,
          adminNotes: adminAuditNote || 'Score manually verified and updated by HOD.'
        };
      }
      return item;
    });

    setSubmissionsList(updatedSubmissions);
    setSelectedAuditLog(null);
    triggerAlert('Score Overridden', `The evaluation score for ${selectedAuditLog.teacherName} has been updated to ${overrideScore}%.`, 'success');
  };

  // Data Filtering
  const deptTeachers = teachersList.filter(t => t.department === selectedDept);
  const filteredSubmissions = submissionsList.filter(s => {
    if (s.department !== selectedDept) return false;
    if (timeRange === 'today' && s.rawDate !== todayRaw) return false;
    if (timeRange === 'custom' && (s.rawDate < customStartDate || s.rawDate > customEndDate)) return false;
    return true;
  });

  const filteredLeaderboard = leaderboardList.filter(l => l.department === selectedDept);
  const todayDeptSubmissions = submissionsList.filter(s => s.department === selectedDept && s.rawDate === todayRaw);
  const submittedTeacherIds = new Set(todayDeptSubmissions.map(s => s.teacherId));
  const missingTeachersList = deptTeachers.filter(t => !submittedTeacherIds.has(t.id));

  const avgScore = filteredSubmissions.length > 0
    ? Math.round(filteredSubmissions.reduce((acc, curr) => acc + curr.score, 0) / filteredSubmissions.length)
    : 0;

  const taskCompletionRates = {
    manual: filteredSubmissions.filter(s => s.tasksCompleted.manualSubmitted).length,
    classes: filteredSubmissions.filter(s => s.tasksCompleted.classesTaken).length,
    registry: filteredSubmissions.filter(s => s.tasksCompleted.registryUpdated).length,
    total: filteredSubmissions.length || 1
  };

  // ==========================================
  // SCREEN 1: LOGIN GATEWAY
  // ==========================================
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-dvh flex flex-col justify-between bg-slate-950 text-white p-6 selection:bg-emerald-600">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/15 to-teal-500/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

        <header className="w-full max-w-md mx-auto flex items-center justify-between py-4 border-b border-slate-900 z-10">
          <div className="flex items-center gap-2.5"><img src="/kite.png" alt="KRHS Logo" className="w-7 h-7 object-contain" /><span className="font-bold text-sm tracking-tight">KRHS<span className="text-emerald-400"> ADMIN</span></span></div>
          <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">← Back to Home</Link>
        </header>

        <div className="max-w-md w-full my-auto mx-auto relative z-10">
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-t-full shadow-lg shadow-emerald-500/30 mb-[-1px] relative z-20" />
          <div className="bg-slate-900/90 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800"><span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">🔒 Security Gateway</span><span className="text-xs font-mono text-slate-500">HOD Portal</span></div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1">Admin Login</h1>
            <p className="text-xs text-slate-400 mb-6">Enter authorization credentials to access evaluations.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div><label className="block text-xs font-bold uppercase text-slate-300 mb-1">Username</label><input type="text" value={usernameInput} onChange={(e) => { setUsernameInput(e.target.value); setLoginError(false); }} placeholder="Username..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500" required /></div>
              <div><div className="flex justify-between items-center mb-1"><label className="block text-xs font-bold uppercase text-slate-300">Password</label><span className="text-[10px] text-emerald-400 font-mono">Hint: {adminCreds.username} / {adminCreds.password}</span></div><input type="password" value={passwordInput} onChange={(e) => { setPasswordInput(e.target.value); setLoginError(false); }} placeholder="Password..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono" required /></div>
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
  // SCREEN 2: SIDEBAR COMMAND CENTER
  // ==========================================
  return (
    <div className="min-h-dvh flex bg-slate-950 text-white selection:bg-emerald-600">
      
      {/* ================================================================= */}
      {/* REQUIREMENT 2: CUSTOM TAILWIND ALERT MODAL */}
      {/* ================================================================= */}
      {customAlert.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center animate-[fadeInUp_0.2s_ease-out_forwards]">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner ${
              customAlert.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
              customAlert.type === 'warning' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' :
              'bg-blue-500/10 border border-blue-500/20 text-blue-400'
            }`}>
              {customAlert.type === 'success' ? '✓' : customAlert.type === 'warning' ? '⚠️' : 'ℹ️'}
            </div>
            <h3 className="text-lg font-black text-white mb-2">{customAlert.title}</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">{customAlert.message}</p>
            <button
              onClick={() => setCustomAlert({ ...customAlert, isOpen: false })}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition active:scale-[0.98]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Audit & Score Override Modal */}
      {selectedAuditLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-[fadeInUp_0.2s_ease-out_forwards]">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">{selectedAuditLog.teacherName}</h2>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-md border border-slate-700">{selectedAuditLog.department}</span>
                  {selectedAuditLog.isOverridden ? (
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded-full border border-purple-500/20">★ HOD Overridden</span>
                  ) : (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">✓ Auto-Verified</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedAuditLog.subject} • Submitted on <span className="text-white font-medium">{selectedAuditLog.rawDate} ({selectedAuditLog.date})</span></p>
              </div>
              <button onClick={() => setSelectedAuditLog(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs font-bold">✕ Close</button>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <span>🔍</span><span>Submitted Checklist Responses</span>
              </h3>
              
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
                {mockQuestions.map((q) => {
                  const teacherAnswer = selectedAuditLog.answers?.[q.id] || 'N/A';
                  const isYes = teacherAnswer === 'Yes';
                  const isNo = teacherAnswer === 'No';

                  return (
                    <div key={q.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-xs font-medium text-slate-300 flex-1 pr-4">{q.text}</div>
                      <div className="shrink-0">
                        {q.type === 'boolean' ? (
                          <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                            isYes ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : isNo ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {isYes ? '✓ YES' : isNo ? '✕ NO' : teacherAnswer}
                          </span>
                        ) : (
                          <span className="text-xs font-mono bg-slate-900 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800 block sm:inline italic">
                            "{teacherAnswer}"
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSaveOverride} className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="text-xs font-bold text-white uppercase tracking-wider">HOD Score Override & Audit</span>
                <span className="text-xs text-slate-400">Current Auto-Score: <b className="text-emerald-400 font-mono">{selectedAuditLog.score}%</b></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Override Score (0 - 100)</label>
                  <input type="number" min="0" max="100" value={overrideScore} onChange={(e) => setOverrideScore(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-emerald-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Verification Status</label>
                  <select value={overrideStatus} onChange={(e) => setOverrideStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 outline-none font-semibold">
                    <option value="Complete">Complete (Verified)</option>
                    <option value="Partial">Partial</option>
                    <option value="Overridden">Overridden (Manual Adjust)</option>
                    <option value="Rejected">Rejected (Misleading)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">HOD Audit Remark / Explanation</label>
                <textarea rows={2} value={adminAuditNote} onChange={(e) => setAdminAuditNote(e.target.value)} placeholder="e.g., Verified teacher manual was present on desk. Or: Class registry incomplete, docked 30 points." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 outline-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelectedAuditLog(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20">Save Override & Verify ✓</button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl animate-[fadeInUp_0.2s_ease-out_forwards]">
            <h2 className="text-lg font-black mb-1">⚙️ Update Account Settings</h2>
            <p className="text-xs text-slate-400 mb-6">Change your administrator username and password.</p>
            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div><label className="block text-xs font-bold uppercase text-slate-300 mb-1">New Username</label><input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" required /></div>
              <div><label className="block text-xs font-bold uppercase text-slate-300 mb-1">New Password</label><input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none font-mono" required /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsSettingsOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 font-bold py-3 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Faculty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl animate-[fadeInUp_0.2s_ease-out_forwards]">
            <h2 className="text-lg font-black mb-1">👨‍🏫 Add Faculty Member</h2>
            <p className="text-xs text-slate-400 mb-6">Add a new teacher to the directory for evaluation.</p>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div><label className="block text-xs font-bold uppercase text-slate-300 mb-1">Full Name</label><input type="text" value={newTeacherForm.name} onChange={e => setNewTeacherForm({...newTeacherForm, name: e.target.value})} placeholder="e.g. Priya Nair" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" required /></div>
              <div><label className="block text-xs font-bold uppercase text-slate-300 mb-1">Subject Taught</label><input type="text" value={newTeacherForm.subject} onChange={e => setNewTeacherForm({...newTeacherForm, subject: e.target.value})} placeholder="e.g. Social Studies" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none" required /></div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Department</label>
                <select value={newTeacherForm.department} onChange={e => setNewTeacherForm({...newTeacherForm, department: e.target.value as any})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none">
                  <option value="UP & HS">UP & HS</option><option value="LP">LP</option><option value="KG">KG</option><option value="HSS">HSS</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-2 bg-slate-950 rounded-xl border border-slate-800">
                <input type="checkbox" checked={newTeacherForm.isClassTeacher} onChange={e => setNewTeacherForm({...newTeacherForm, isClassTeacher: e.target.checked})} className="w-4 h-4 text-emerald-600 rounded" />
                <span className="text-xs font-bold text-slate-300">Assign as Class Teacher</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 font-bold py-3 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20">+ Add Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FIXED LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col justify-between p-6 shrink-0 hidden lg:flex sticky top-0 h-dvh z-30">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-sm shrink-0">
              <img src="/kite.png" alt="KRHS Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight block leading-none">KRHS<span className="text-emerald-400"> ADMIN</span></span>
              <span className="text-[10px] text-slate-500 font-mono">HOD Portal v2.0</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Department Scope</label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80">
              {['UP & HS', 'LP', 'KG', 'HSS'].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${selectedDept === dept ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <nav className="space-y-1.5">
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Analytics & Management</label>
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}><span>📊</span><span>Overview & Charts</span></button>
            <button onClick={() => setActiveTab('defaulters')} className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'defaulters' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}><div className="flex items-center gap-3"><span>⚠️</span><span>Missing Logs</span></div>{missingTeachersList.length > 0 && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">{missingTeachersList.length}</span>}</button>
            <button onClick={() => setActiveTab('submissions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'submissions' ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}><span>📋</span><span>Submissions Report</span></button>
            <button onClick={() => setActiveTab('faculty')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === 'faculty' ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}><span>👨‍🏫</span><span>Faculty Directory</span></button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800/60 hover:text-white transition"><span>⚙️</span><span>Account Settings</span></button>
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition"><span>🚪</span><span>Logout System</span></button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        <header className="lg:hidden w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md p-4 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2"><img src="/kite.png" alt="KRHS Logo" className="w-6 h-6" /><span className="font-black text-sm">KRHS<span className="text-emerald-400"> ADMIN</span></span></div>
          <div className="flex gap-2">
            <button onClick={() => setIsSettingsOpen(true)} className="text-xs bg-slate-900 p-2 rounded-lg border border-slate-800">⚙️</button>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs bg-slate-900 text-red-400 p-2 rounded-lg border border-slate-800">Logout</button>
          </div>
        </header>

        <main className="p-4 sm:p-8 space-y-8 max-w-6xl mx-auto w-full flex-1">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2"><h1 className="text-2xl font-black text-white">{selectedDept} Evaluation Engine</h1><span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">Live Analytics</span></div>
              <p className="text-xs text-slate-400 mt-1">Showing data based on task completion and daily logging compliance.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start">
                {(['today', 'month', 'custom'] as const).map((period) => (
                  <button key={period} onClick={() => setTimeRange(period)} className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${timeRange === period ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'text-slate-400 hover:text-white'}`}>{period === 'today' ? 'Today' : period === 'month' ? 'This Month' : 'Custom Range'}</button>
                ))}
              </div>
              {timeRange === 'custom' && (
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800 text-xs animate-[fadeInUp_0.2s_ease-out_forwards]">
                  <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="bg-transparent text-emerald-400 font-mono outline-none" />
                  <span className="text-slate-600">→</span>
                  <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="bg-transparent text-emerald-400 font-mono outline-none" />
                </div>
              )}
            </div>
          </div>

          {/* TAB 1: ANALYTICS OVERVIEW & ANIMATED RACING CHARTS */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-[fadeInUp_0.3s_ease-out_forwards]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">Average Task Score</div>
                  <div className="text-3xl font-black text-white flex items-baseline gap-2"><span>{avgScore}%</span><span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Task Weighted</span></div>
                  <p className="text-xs text-slate-500 mt-2">Calculated from {filteredSubmissions.length} logged reports</p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">Today's Submission Rate</div>
                  <div className="text-3xl font-black text-white flex items-baseline gap-2"><span>{deptTeachers.length - missingTeachersList.length} / {deptTeachers.length}</span><span className="text-xs font-semibold text-emerald-400">Faculty</span></div>
                  <p className="text-xs text-slate-500 mt-2">{missingTeachersList.length} faculty still pending today</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 rounded-3xl border border-amber-500/30">
                  <div className="text-amber-400 text-xs font-bold uppercase mb-1 flex items-center gap-1.5"><span>👑</span><span>Top Performer</span></div>
                  <div className="text-2xl font-black text-white truncate">{filteredLeaderboard[0]?.name || 'No Data'}</div>
                  <p className="text-xs text-amber-300/80 mt-2 font-semibold">Score: {filteredLeaderboard[0]?.monthlyScore || 0} / 100 • 14 Day Streak</p>
                </div>
              </div>

              {/* ================================================================= */}
              {/* REQUIREMENT 3: ANIMATED RACING CHARTS */}
              {/* ================================================================= */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Chart 1: Task Completion Breakdown (Animated Racing Bars) */}
                <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white mb-1">Task Completion Analysis</h2>
                    <p className="text-xs text-slate-400 mb-6">Percentage of specific checklist tasks marked as completed.</p>
                    
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-300">📖 Teacher Manual Submitted (Monday Task)</span>
                          <span className="text-emerald-400 font-mono">{Math.round((taskCompletionRates.manual / taskCompletionRates.total) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                          {/* Notice: animate-[chartRace_1s_ease-out_forwards] */}
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full animate-[chartRace_1.2s_ease-out_forwards]" 
                            style={{ width: `${(taskCompletionRates.manual / taskCompletionRates.total) * 100}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-300">💻 IT & Language Classes Completed</span>
                          <span className="text-emerald-400 font-mono">{Math.round((taskCompletionRates.classes / taskCompletionRates.total) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full animate-[chartRace_1.4s_ease-out_forwards]" 
                            style={{ width: `${(taskCompletionRates.classes / taskCompletionRates.total) * 100}%` }} 
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-300">📋 Class Teacher Attendance Registry</span>
                          <span className="text-emerald-400 font-mono">{Math.round((taskCompletionRates.registry / taskCompletionRates.total) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full animate-[chartRace_1.6s_ease-out_forwards]" 
                            style={{ width: `${(taskCompletionRates.registry / taskCompletionRates.total) * 100}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500"><span>Task Weightage: 35% Manual • 35% Classes • 30% Registry</span><span className="text-emerald-400 font-semibold">Live Feed</span></div>
                </div>

                {/* Chart 2: Faculty Leaderboard Racing Bars */}
                <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6"><div><h2 className="text-lg font-black text-white">Monthly Evaluation Rankings</h2><p className="text-xs text-slate-400">Automated Best Teacher algorithm scores.</p></div><span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2.5 py-1 rounded-full border border-amber-500/20">★ Award Active</span></div>
                    <div className="space-y-4">
                      {filteredLeaderboard.map((t, i) => (
                        <div key={t.teacherId} className="flex items-center gap-4 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${t.rank === 1 ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>{t.rank === 1 ? '👑' : `#${t.rank}`}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-xs font-bold mb-1"><span className="text-white truncate">{t.name}</span><span className="text-emerald-400 font-mono">{t.monthlyScore} / 100</span></div>
                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                              {/* Staggered animation duration based on ranking index (i) */}
                              <div 
                                className={`h-full rounded-full animate-[chartRace_1s_ease-out_forwards] ${t.rank === 1 ? 'bg-gradient-to-r from-amber-500 to-yellow-300' : 'bg-emerald-500'}`} 
                                style={{ width: `${t.monthlyScore}%`, animationDuration: `${1 + i * 0.2}s` }} 
                              />
                            </div>
                          </div>
                          <div className="text-right shrink-0"><span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">{t.streak}d 🔥</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MISSING SUBMISSIONS TRACKER */}
          {activeTab === 'defaulters' && (
            <div className="bg-slate-900/80 rounded-3xl border border-red-500/30 overflow-hidden shadow-2xl animate-[fadeInUp_0.3s_ease-out_forwards]">
              <div className="p-6 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between flex-wrap gap-4">
                <div><h2 className="text-lg font-black text-white flex items-center gap-2"><span>⚠️ Pending Daily Submissions ({missingTeachersList.length})</span></h2><p className="text-xs text-red-300 mt-0.5">Faculty members in {selectedDept} who have NOT yet submitted today's checklist ({todayRaw}).</p></div>
                {missingTeachersList.length > 0 && (
                  <button 
                    onClick={() => triggerAlert('Reminders Blast Sent', 'Automatic email and SMS alerts have been sent to all pending faculty members.', 'warning')} 
                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-lg shadow-red-600/20 transition"
                  >
                    Send Reminder Blast →
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/60">
                {missingTeachersList.length === 0 ? (
                  <div className="p-12 text-center"><div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">✓</div><h3 className="font-bold text-white text-base">100% Compliance Achieved!</h3><p className="text-xs text-slate-400 mt-1">All {deptTeachers.length} faculty members in {selectedDept} have successfully submitted their reports today.</p></div>
                ) : (
                  missingTeachersList.map((t) => (
                    <div key={t.id} className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">✕</div>
                        <div><div className="flex items-center gap-2"><span className="font-bold text-white text-base">{t.name}</span>{t.isClassTeacher && <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">Class Teacher</span>}</div><p className="text-xs text-slate-400">{t.subject} • <span className="text-red-400 font-medium">Status: Not Submitted Today</span></p></div>
                      </div>
                      <button 
                        onClick={() => triggerAlert('Ping Sent', `An immediate HOD notification ping was dispatched to ${t.name}.`, 'info')} 
                        className="text-xs font-bold bg-slate-950 hover:bg-red-500/10 text-slate-300 hover:text-red-400 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-red-500/30 transition"
                      >
                        Ping HOD Reminder 💬
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SUBMISSIONS REPORT */}
          {activeTab === 'submissions' && (
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl animate-[fadeInUp_0.3s_ease-out_forwards]">
              <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
                <div><h2 className="text-lg font-black text-white">{selectedDept} Submissions Log ({filteredSubmissions.length})</h2><p className="text-xs text-slate-400">Detailed feed filtered by time period ({timeRange}). Click any log to inspect answers or override score.</p></div>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Audit Trail Ready</span>
              </div>
              <div className="divide-y divide-slate-800/60">
                {filteredSubmissions.length === 0 ? (
                  <p className="p-8 text-center text-slate-500 text-sm">No submissions found for the selected time range ({timeRange}).</p>
                ) : (
                  filteredSubmissions.map((log) => (
                    <div key={log.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white text-base">{log.teacherName}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${log.status === 'Complete' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : log.status === 'Overridden' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 font-extrabold' : log.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{log.status}</span>
                          
                          {/* ================================================================= */}
                          {/* REQUIREMENT 1: AUTOMATIC AUTO-VERIFICATION BADGE */}
                          {/* ================================================================= */}
                          {log.isOverridden ? (
                            <span className="text-[10px] bg-purple-950 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-800">★ HOD Overridden</span>
                          ) : (
                            <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded border border-slate-700">✓ Auto-Verified</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{log.subject} • Logged on <span className="text-slate-300 font-medium">{log.rawDate} ({log.date})</span></p>
                        
                        {log.adminNotes ? (
                          <div className="mt-2 text-xs bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/30 text-purple-200 flex items-start gap-2 max-w-xl"><span className="text-purple-400">🛡️ HOD Audit Note:</span><span className="italic">"{log.adminNotes}"</span></div>
                        ) : log.notes ? (
                          <div className="mt-2 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300 flex items-start gap-2 max-w-xl"><span className="text-slate-500">💬 Teacher Remark:</span><span className="italic">"{log.notes}"</span></div>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-right shrink-0">
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Task Score</div>
                          <div className={`text-base font-black ${log.status === 'Rejected' ? 'text-red-400 line-through' : log.isOverridden ? 'text-purple-400' : 'text-emerald-400'}`}>{log.score}% Score</div>
                        </div>

                        <button
                          onClick={() => handleOpenAuditModal(log)}
                          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3 rounded-2xl text-xs transition border border-slate-700 flex items-center gap-1.5 shadow-sm shrink-0"
                        >
                          <span>🔍 Inspect & Verify</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FACULTY DIRECTORY */}
          {activeTab === 'faculty' && (
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl animate-[fadeInUp_0.3s_ease-out_forwards]">
              <div className="p-6 border-b border-slate-800/80 flex justify-between items-center flex-wrap gap-4">
                <div><h2 className="text-lg font-black text-white">{selectedDept} Staff Directory</h2><p className="text-xs text-slate-400">Manage active faculty members.</p></div>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition">+ Add New Teacher</button>
              </div>
              <div className="divide-y divide-slate-800/60">
                {deptTeachers.map((t) => (
                  <div key={t.id} className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">👤</div>
                      <div>
                        <div className="flex items-center gap-2"><span className="font-bold text-white text-base">{t.name}</span>{t.isClassTeacher && <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">Class Teacher</span>}</div>
                        <p className="text-xs text-slate-400">{t.subject} • <span className="text-emerald-400 font-semibold">{t.department}</span></p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteTeacher(t)} className="text-xs font-bold bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 px-3 py-2 rounded-xl border border-slate-800 hover:border-red-500/30 transition">Remove ✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

        <footer className="w-full text-center py-6 mt-auto text-xs text-slate-500 border-t border-slate-900/80">
          <p>EduMonitor System • HOD Evaluation Engine</p>
          <p className="mt-1 text-slate-400 font-medium tracking-wide">Designed by <span className="text-emerald-400 font-semibold">Code Craft</span> | 6282811230</p>
        </footer>
      </div>

      {/* ================================================================= */}
      {/* REQUIREMENT 3: CHART RACING ANIMATION KEYFRAMES */}
      {/* ================================================================= */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chartRace {
          from { width: 0%; }
        }
      `}} />
    </div>
  );
}