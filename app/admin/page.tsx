"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Teacher,
  TeacherRanking,
  DailyLogSubmission,
  Question,
  initialLeaderboard, // Keeping mock leaderboard until we build a complex SQL query for it
} from "../data/mockData";
import {
  getTeachers,
  getSubmissions,
  getQuestions,
  addTeacherToDb,
  deleteTeacherFromDb,
  saveQuestionToDb,
  deleteQuestionFromDb,
  updateSubmissionOverride,
} from "../actions";

interface AlertModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
}

export default function AdminDashboard() {
  // ==========================================
  // UNCOMMENTED & RESTORED STATE VARIABLES
  // ==========================================

  // Auth & Settings State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<boolean>(false);
  const [adminCreds, setAdminCreds] = useState({
    username: "admin",
    password: "admin123",
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("admin");
  const [newPassword, setNewPassword] = useState<string>("admin123");

  // Navigation & Filter State
  const [activeTab, setActiveTab] = useState<
    | "analytics"
    | "defaulters"
    | "submissions"
    | "faculty"
    | "questions"
    | "breakdown"
  >("analytics");
  const [selectedDept, setSelectedDept] = useState<string>("UP & HS");
  const [timeRange, setTimeRange] = useState<"today" | "month" | "custom">(
    "today",
  );
  const [customStartDate, setCustomStartDate] = useState<string>("2026-07-01");
  const [customEndDate, setCustomEndDate] = useState<string>("2026-07-12");

  // Add Faculty Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newTeacherForm, setNewTeacherForm] = useState({
    name: "",
    subject: "",
    department: "UP & HS" as any,
    isClassTeacher: false,
  });

  // Question Studio (CRUD) State
  const [isQuestionModalOpen, setIsQuestionModalOpen] =
    useState<boolean>(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [questionForm, setQuestionForm] = useState<Omit<Question, "id">>({
    text: "",
    type: "boolean",
    group: "common",
    points: 25,
    day: "Everyday",
  });

  // Item-by-Item Breakdown State
  const [selectedBreakdownQuestionId, setSelectedBreakdownQuestionId] =
    useState<string>("q1");

  // Audit & Override Modal State
  const [selectedAuditLog, setSelectedAuditLog] =
    useState<DailyLogSubmission | null>(null);
  const [overrideScore, setOverrideScore] = useState<number>(100);
  const [overrideStatus, setOverrideStatus] = useState<any>("Complete");
  const [adminAuditNote, setAdminAuditNote] = useState<string>("");

  // Custom Alert State
  const [customAlert, setCustomAlert] = useState<AlertModalState>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  // Database Data Lists
  const [teachersList, setTeachersList] = useState<Teacher[]>([]);
  const [submissionsList, setSubmissionsList] = useState<DailyLogSubmission[]>(
    [],
  );
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [leaderboardList, setLeaderboardList] =
    useState<TeacherRanking[]>(initialLeaderboard);

  // Fetch all database tables when Admin logs in or page loads
  const loadAdminDatabase = async () => {
    const [tData, sData, qData] = await Promise.all([
      getTeachers(),
      getSubmissions(),
      getQuestions(),
    ]);
    setTeachersList(tData);
    setSubmissionsList(sData);
    setQuestionsList(qData);
  };

  useEffect(() => {
    loadAdminDatabase();
  }, []);

  const triggerAlert = (
    title: string,
    message: string,
    type: "success" | "warning" | "info" = "info",
  ) => {
    setCustomAlert({ isOpen: true, title, message, type });
  };

  const todayRaw = new Date().toISOString().split("T")[0]; // Dynamically grabs today's YYYY-MM-DD
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // =================================================================
  // NATIVE PDF EXPORT ENGINE
  // =================================================================
  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      triggerAlert(
        "Popup Blocked",
        "Please allow popups to generate the PDF report.",
        "warning",
      );
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Defaulters Report - ${selectedDept}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: 900; margin: 0 0 8px 0; color: #0f172a; }
            .subtitle { color: #64748b; font-size: 14px; margin: 0; }
            .badge { background: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
            th { background-color: #f8fafc; font-weight: 700; color: #334155; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .status { color: #dc2626; font-weight: 600; }
            @media print {
              @page { margin: 20mm; size: portrait; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">KRHS International</h1>
            <p class="subtitle" style="font-size: 16px; font-weight: 600; color: #334155; margin-bottom: 12px;">Daily Submissions Defaulter Report</p>
            <p class="subtitle">Department: <strong>${selectedDept}</strong> | Date: <strong>${todayFormatted}</strong></p>
            <p class="subtitle" style="margin-top: 8px;">Pending Submissions: <span class="badge">${missingTeachersList.length} Faculty Members</span></p>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 5%">#</th>
                <th style="width: 35%">Faculty Name</th>
                <th style="width: 30%">Subject</th>
                <th style="width: 15%">Role</th>
                <th style="width: 15%">Status</th>
              </tr>
            </thead>
            <tbody>
              ${missingTeachersList
                .map(
                  (t, i) => `
                <tr>
                  <td style="color: #64748b; font-weight: 600;">${i + 1}</td>
                  <td><strong>${t.name}</strong></td>
                  <td style="color: #475569;">${t.subject}</td>
                  <td>${t.isClassTeacher ? "Class Teacher" : "Subject"}</td>
                  <td class="status">✕ Missing</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      triggerAlert(
        "Report Generated",
        "PDF generated successfully.",
        "success",
      );
    }, 250);
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (usernameInput === adminCreds.username || usernameInput === "admin") &&
      passwordInput === adminCreds.password
    ) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    const newT: Teacher = {
      id: `t_${Date.now()}`,
      name: newTeacherForm.name,
      subject: newTeacherForm.subject,
      department: newTeacherForm.department,
      isClassTeacher: newTeacherForm.isClassTeacher,
    };

    const res = await addTeacherToDb(newT);
    if (res.success) {
      await loadAdminDatabase();
      setIsAddModalOpen(false);
      setNewTeacherForm({
        name: "",
        subject: "",
        department: "UP & HS",
        isClassTeacher: false,
      });
      triggerAlert(
        "Faculty Added",
        `${newT.name} has been successfully saved to the database.`,
        "success",
      );
    } else {
      triggerAlert(
        "Database Error",
        "Failed to add teacher to Supabase.",
        "warning",
      );
    }
  };

  const handleDeleteTeacher = async (t: Teacher) => {
    const res = await deleteTeacherFromDb(t.id);
    if (res.success) {
      await loadAdminDatabase();
      triggerAlert(
        "Faculty Removed",
        `${t.name} has been deleted from the database.`,
        "warning",
      );
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();

    // Set the primary credential checker state
    setAdminCreds({ username: newUsername, password: newPassword });
    setIsSettingsOpen(false);

    triggerAlert(
      "Settings Updated",
      `Admin credentials updated successfully! New Username: ${newUsername}`,
      "success",
    );
  };

  // =================================================================
  // QUESTION STUDIO CRUD HANDLERS
  // =================================================================
  const handleOpenAddQuestion = () => {
    setEditingQuestionId(null);
    setQuestionForm({
      text: "",
      type: "boolean",
      group: "common",
      points: 25,
      day: "Everyday",
    });
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestionId(q.id);
    setQuestionForm({
      text: q.text,
      type: q.type,
      group: q.group,
      points: q.points,
      day: q.day || "Everyday",
    });
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const questionToSave = editingQuestionId
      ? { ...questionForm, id: editingQuestionId }
      : { ...questionForm, id: `q_${Date.now()}` };

    const res = await saveQuestionToDb(questionToSave);
    if (res.success) {
      await loadAdminDatabase();
      setIsQuestionModalOpen(false);
      triggerAlert(
        "Question Saved",
        "The evaluation checklist question has been updated in Supabase.",
        "success",
      );
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    const res = await deleteQuestionFromDb(id);
    if (res.success) {
      await loadAdminDatabase();
      triggerAlert(
        "Question Removed",
        "The question has been deleted from future evaluation checklists.",
        "warning",
      );
    }
  };

  const handleOpenAuditModal = (log: DailyLogSubmission) => {
    setSelectedAuditLog(log);
    setOverrideScore(log.score);
    setOverrideStatus(log.status);
    setAdminAuditNote(log.adminNotes || "");
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuditLog) return;

    const res = await updateSubmissionOverride(
      selectedAuditLog.id,
      Number(overrideScore),
      overrideStatus,
      adminAuditNote || "Score manually verified and updated by HOD.",
    );

    if (res.success) {
      await loadAdminDatabase();
      setSelectedAuditLog(null);
      triggerAlert(
        "Score Overridden",
        `The evaluation score for ${selectedAuditLog.teacherName} has been permanently updated to ${overrideScore}%.`,
        "success",
      );
    }
  };

  // Data Filtering
  const deptTeachers = teachersList.filter(
    (t) => t.department === selectedDept,
  );
  const filteredSubmissions = submissionsList.filter((s) => {
    if (s.department !== selectedDept) return false;
    if (timeRange === "today" && s.rawDate !== todayRaw) return false;
    if (
      timeRange === "custom" &&
      (s.rawDate < customStartDate || s.rawDate > customEndDate)
    )
      return false;
    return true;
  });

  const filteredLeaderboard = leaderboardList.filter(
    (l) => l.department === selectedDept,
  );
  const todayDeptSubmissions = submissionsList.filter(
    (s) => s.department === selectedDept && s.rawDate === todayRaw,
  );
  const submittedTeacherIds = new Set(
    todayDeptSubmissions.map((s) => s.teacherId),
  );
  const missingTeachersList = deptTeachers.filter(
    (t) => !submittedTeacherIds.has(t.id),
  );

  const avgScore =
    filteredSubmissions.length > 0
      ? Math.round(
          filteredSubmissions.reduce((acc, curr) => acc + curr.score, 0) /
            filteredSubmissions.length,
        )
      : 0;

  const taskCompletionRates = {
    manual:
      filteredSubmissions.filter((s) => s.tasksCompleted?.manualSubmitted)
        .length || 0,
    classes:
      filteredSubmissions.filter((s) => s.tasksCompleted?.classesTaken)
        .length || 0,
    registry:
      filteredSubmissions.filter((s) => s.tasksCompleted?.registryUpdated)
        .length || 0,
    total: filteredSubmissions.length || 1,
  };

  // ==========================================
  // SCREEN 1: LOGIN GATEWAY
  // ==========================================
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-dvh flex flex-col justify-between bg-slate-950 text-white p-6 selection:bg-emerald-600">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-20" />
        {/* FIXED: bg-gradient-to-tr instead of bg-linear-to-tr */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/15 to-teal-500/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse duration-[6000ms]" />

        <header className="w-full max-w-md mx-auto flex items-center justify-between py-4 border-b border-slate-900 z-10">
          <div className="flex items-center gap-2.5">
            <Image
              src="/kite.png"
              alt="KRHS Logo"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="font-bold text-sm tracking-tight">
              KRHS<span className="text-emerald-400"> ADMIN</span>
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            ← Back to Home
          </Link>
        </header>

        <div className="max-w-md w-full my-auto mx-auto relative z-10">
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-t-full shadow-lg shadow-emerald-500/30 mb-[-1px] relative z-20" />
          <div className="bg-slate-900/90 p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800/80 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                🔒 Security Gateway
              </span>
              <span className="text-xs font-mono text-slate-500">
                HOD Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1">
              Admin Login
            </h1>
            <p className="text-xs text-slate-400 mb-6">
              Enter authorization credentials to access evaluations.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setLoginError(false);
                  }}
                  placeholder="Username..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase text-slate-300">
                    Password
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Hint: {adminCreds.username} / {adminCreds.password}
                  </span>
                </div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError(false);
                  }}
                  placeholder="Password..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>
              {loginError && (
                <p className="text-red-400 text-xs mt-2 animate-pulse">
                  ⚠️ Incorrect username or password.
                </p>
              )}
              <button
                type="submit"
                className="w-full font-bold py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white shadow-xl shadow-emerald-600/20 transition-all text-sm"
              >
                Unlock Command Center →
              </button>
            </form>
          </div>
        </div>
        <footer className="w-full text-center py-4 text-xs text-slate-500">
          Powered by{" "}
          <span className="text-emerald-400 font-semibold">Code Craft</span> |
          6282811230
        </footer>
      </main>
    );
  }

  // ==========================================
  // SCREEN 2: SIDEBAR COMMAND CENTER
  // ==========================================
  return (
    <div className="min-h-dvh flex bg-slate-950 text-white selection:bg-emerald-600">
      {/* Custom Alert Modal */}
      {customAlert.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center animate-[fadeInUp_0.2s_ease-out_forwards]">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner ${
                customAlert.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : customAlert.type === "warning"
                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                    : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
              }`}
            >
              {customAlert.type === "success"
                ? "✓"
                : customAlert.type === "warning"
                  ? "⚠️"
                  : "ℹ️"}
            </div>
            <h3 className="text-lg font-black text-white mb-2">
              {customAlert.title}
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {customAlert.message}
            </p>
            <button
              onClick={() => setCustomAlert({ ...customAlert, isOpen: false })}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs transition active:scale-[0.98]"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* REQUIREMENT 1: QUESTION STUDIO MODAL */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl animate-[fadeInUp_0.2s_ease-out_forwards]">
            <h2 className="text-lg font-black text-white mb-1">
              {editingQuestionId
                ? "✏️ Edit Checklist Question"
                : "❓ Add New Checklist Question"}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Configure question type, target audience, points, and day
              triggers.
            </p>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Question Text
                </label>
                <input
                  type="text"
                  value={questionForm.text}
                  onChange={(e) =>
                    setQuestionForm({ ...questionForm, text: e.target.value })
                  }
                  placeholder="e.g., Did you complete lesson plan evaluation?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                    Response Type
                  </label>
                  <select
                    value={questionForm.type}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none font-semibold"
                  >
                    <option value="boolean">Yes / No (Task Boolean)</option>
                    <option value="text">Text Remark / Explanation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                    Target Group
                  </label>
                  <select
                    value={questionForm.group}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        group: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none font-semibold"
                  >
                    <option value="common">Common (All Teachers)</option>
                    <option value="class_teacher">Class Teachers Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                    Schedule Day Trigger
                  </label>
                  <select
                    value={questionForm.day}
                    onChange={(e) =>
                      setQuestionForm({
                        ...questionForm,
                        day: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-emerald-500 outline-none font-semibold"
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20"
                >
                  Save Question ✓
                </button>
              </div>
            </form>
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
                  <h2 className="text-xl font-black text-white">
                    {selectedAuditLog.teacherName}
                  </h2>
                  <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-md border border-slate-700">
                    {selectedAuditLog.department}
                  </span>
                  {selectedAuditLog.isOverridden ? (
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded-full border border-purple-500/20">
                      ★ HOD Overridden
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                      ✓ Auto-Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedAuditLog.subject} • Submitted on{" "}
                  <span className="text-white font-medium">
                    {selectedAuditLog.rawDate} ({selectedAuditLog.date})
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                <span>🔍</span>
                <span>Submitted Checklist Responses</span>
              </h3>
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
                {questionsList.map((q) => {
                  const teacherAnswer =
                    selectedAuditLog.answers?.[q.id] || "N/A";
                  const isYes = teacherAnswer === "Yes";
                  const isNo = teacherAnswer === "No";
                  return (
                    <div
                      key={q.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="text-xs font-medium text-slate-300 flex-1 pr-4">
                        {q.text}
                      </div>
                      <div className="shrink-0">
                        {q.type === "boolean" ? (
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                              isYes
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : isNo
                                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                                  : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}
                          >
                            {isYes ? "✓ YES" : isNo ? "✕ NO" : teacherAnswer}
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

            <form
              onSubmit={handleSaveOverride}
              className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  HOD Score Override & Audit
                </span>
                <span className="text-xs text-slate-400">
                  Current Auto-Score:{" "}
                  <b className="text-emerald-400 font-mono">
                    {selectedAuditLog.score}%
                  </b>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Override Score (0 - 100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={overrideScore}
                    onChange={(e) => setOverrideScore(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Verification Status
                  </label>
                  <select
                    value={overrideStatus}
                    onChange={(e) => setOverrideStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-emerald-500 outline-none font-semibold"
                  >
                    <option value="Complete">Complete (Verified)</option>
                    <option value="Partial">Partial</option>
                    <option value="Overridden">
                      Overridden (Manual Adjust)
                    </option>
                    <option value="Rejected">Rejected (Misleading)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  HOD Audit Remark / Explanation
                </label>
                <textarea
                  rows={2}
                  value={adminAuditNote}
                  onChange={(e) => setAdminAuditNote(e.target.value)}
                  placeholder="e.g., Verified teacher manual present on desk. Or: Class registry incomplete, docked 30 points."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAuditLog(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20"
                >
                  Save Override & Verify ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full shadow-2xl animate-[fadeInUp_0.2s_ease-out_forwards]">
            <h2 className="text-lg font-black mb-1">
              ⚙️ Update Account Settings
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Change your administrator username and password.
            </p>
            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  New Username
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none font-mono"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 font-bold py-3 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20"
                >
                  Save Changes
                </button>
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
            <p className="text-xs text-slate-400 mb-6">
              Add a new teacher to the directory for evaluation.
            </p>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newTeacherForm.name}
                  onChange={(e) =>
                    setNewTeacherForm({
                      ...newTeacherForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Priya Nair"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Subject Taught
                </label>
                <input
                  type="text"
                  value={newTeacherForm.subject}
                  onChange={(e) =>
                    setNewTeacherForm({
                      ...newTeacherForm,
                      subject: e.target.value,
                    })
                  }
                  placeholder="e.g. Social Studies"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={newTeacherForm.department}
                  onChange={(e) =>
                    setNewTeacherForm({
                      ...newTeacherForm,
                      department: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none"
                >
                  <option value="UP & HS">UP & HS</option>
                  <option value="LP">LP</option>
                  <option value="KG">KG</option>
                  <option value="HSS">HSS</option>
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-2 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={newTeacherForm.isClassTeacher}
                  onChange={(e) =>
                    setNewTeacherForm({
                      ...newTeacherForm,
                      isClassTeacher: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-xs font-bold text-slate-300">
                  Assign as Class Teacher
                </span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 font-bold py-3 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-xs shadow-lg shadow-emerald-600/20"
                >
                  + Add Teacher
                </button>
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
              <Image
                src="/kite.png"
                alt="KRHS Logo"
                width={24}
                height={24}
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

          <nav className="space-y-1.5">
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
              Analytics & Management
            </label>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "analytics"
                  ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span>📊</span>
              <span>Overview & Charts</span>
            </button>
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
              {missingTeachersList.length > 0 && (
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {missingTeachersList.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "submissions"
                  ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span>📋</span>
              <span>Submissions Report</span>
            </button>

            <button
              onClick={() => setActiveTab("questions")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "questions"
                  ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span>❓</span>
              <span>Question Studio</span>
            </button>
            <button
              onClick={() => setActiveTab("breakdown")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "breakdown"
                  ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span>🎯</span>
              <span>Item Breakdown</span>
            </button>

            <button
              onClick={() => setActiveTab("faculty")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeTab === "faculty"
                  ? "bg-emerald-600/15 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <span>👨‍🏫</span>
              <span>Faculty Directory</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => {
              setNewUsername(adminCreds.username);
              setNewPassword(adminCreds.password);
              setIsSettingsOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
          >
            <span>⚙️</span>
            <span>Account Settings</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition"
          >
            <span>🚪</span>
            <span>Logout System</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="lg:hidden w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md p-4 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/kite.png"
              alt="KRHS Logo"
              width={24}
              height={24}
              className="object-contain"
            />
            <span className="font-black text-sm">
              KRHS<span className="text-emerald-400"> ADMIN</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs bg-slate-900 p-2 rounded-lg border border-slate-800"
            >
              ⚙️
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs bg-slate-900 text-red-400 p-2 rounded-lg border border-slate-800"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-8 space-y-8 max-w-6xl mx-auto w-full flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">
                  {selectedDept} Evaluation Engine
                </h1>
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Live Analytics
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Showing data based on task completion and daily logging
                compliance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start">
                {(["today", "month", "custom"] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeRange(period)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      timeRange === period
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {period === "today"
                      ? "Today"
                      : period === "month"
                        ? "This Month"
                        : "Custom Range"}
                  </button>
                ))}
              </div>
              {timeRange === "custom" && (
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800 text-xs animate-[fadeInUp_0.2s_ease-out_forwards]">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="bg-transparent text-emerald-400 font-mono outline-none"
                  />
                  <span className="text-slate-600">→</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="bg-transparent text-emerald-400 font-mono outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* TAB 1: ANALYTICS OVERVIEW & CHARTS */}
          {activeTab === "analytics" && (
            <div className="space-y-8 animate-[fadeInUp_0.3s_ease-out_forwards]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">
                    Average Task Score
                  </div>
                  <div className="text-3xl font-black text-white flex items-baseline gap-2">
                    <span>{avgScore}%</span>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Task Weighted
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Calculated from {filteredSubmissions.length} logged reports
                  </p>
                </div>
                <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">
                    Today's Submission Rate
                  </div>
                  <div className="text-3xl font-black text-white flex items-baseline gap-2">
                    <span>
                      {deptTeachers.length - missingTeachersList.length} /{" "}
                      {deptTeachers.length}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">
                      Faculty
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {missingTeachersList.length} faculty still pending today
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 rounded-3xl border border-amber-500/30">
                  <div className="text-amber-400 text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
                    <span>👑</span>
                    <span>Top Performer</span>
                  </div>
                  <div className="text-2xl font-black text-white truncate">
                    {filteredLeaderboard[0]?.name || "No Data"}
                  </div>
                  <p className="text-xs text-amber-300/80 mt-2 font-semibold">
                    Score: {filteredLeaderboard[0]?.monthlyScore || 0} / 100 •
                    14 Day Streak
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white mb-1">
                      Task Completion Analysis
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">
                      Percentage of specific checklist tasks marked as
                      completed.
                    </p>
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-300">
                            📖 Teacher Manual Submitted (Monday Task)
                          </span>
                          <span className="text-emerald-400 font-mono">
                            {Math.round(
                              (taskCompletionRates.manual /
                                taskCompletionRates.total) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full animate-[chartRace_1.2s_ease-out_forwards]"
                            style={{
                              width: `${(taskCompletionRates.manual / taskCompletionRates.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-300">
                            💻 IT & Language Classes Completed
                          </span>
                          <span className="text-emerald-400 font-mono">
                            {Math.round(
                              (taskCompletionRates.classes /
                                taskCompletionRates.total) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full animate-[chartRace_1.4s_ease-out_forwards]"
                            style={{
                              width: `${(taskCompletionRates.classes / taskCompletionRates.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-slate-300">
                            📋 Class Teacher Attendance Registry
                          </span>
                          <span className="text-emerald-400 font-mono">
                            {Math.round(
                              (taskCompletionRates.registry /
                                taskCompletionRates.total) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full animate-[chartRace_1.6s_ease-out_forwards]"
                            style={{
                              width: `${(taskCompletionRates.registry / taskCompletionRates.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Task Weightage: 35% Manual • 35% Classes • 30% Registry
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      Live Feed
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-lg font-black text-white">
                          Monthly Evaluation Rankings
                        </h2>
                        <p className="text-xs text-slate-400">
                          Automated Best Teacher algorithm scores.
                        </p>
                      </div>
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
                        ★ Award Active
                      </span>
                    </div>
                    <div className="space-y-4">
                      {filteredLeaderboard.map((t, i) => (
                        <div
                          key={t.teacherId}
                          className="flex items-center gap-4 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80"
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                              t.rank === 1
                                ? "bg-amber-500 text-slate-950"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {t.rank === 1 ? "👑" : `#${t.rank}`}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-xs font-bold mb-1">
                              <span className="text-white truncate">
                                {t.name}
                              </span>
                              <span className="text-emerald-400 font-mono">
                                {t.monthlyScore} / 100
                              </span>
                            </div>
                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full animate-[chartRace_1s_ease-out_forwards] ${
                                  t.rank === 1
                                    ? "bg-gradient-to-r from-amber-500 to-yellow-300"
                                    : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${t.monthlyScore}%`,
                                  animationDuration: `${1 + i * 0.2}s`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                              {t.streak}d 🔥
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MISSING SUBMISSIONS TRACKER */}
          {activeTab === "defaulters" && (
            <div className="bg-slate-900/80 rounded-3xl border border-red-500/30 overflow-hidden shadow-2xl animate-[fadeInUp_0.3s_ease-out_forwards]">
              <div className="p-6 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <span>
                      ⚠️ Pending Daily Submissions ({missingTeachersList.length}
                      )
                    </span>
                  </h2>
                  <p className="text-xs text-red-300 mt-0.5">
                    Faculty members in {selectedDept} who have NOT yet submitted
                    today's checklist ({todayRaw}).
                  </p>
                </div>

                {missingTeachersList.length > 0 && (
                  <button
                    onClick={handleExportPDF}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg border border-slate-700 transition active:scale-95 flex items-center gap-2"
                  >
                    <span className="text-base leading-none">📄</span>
                    <span>Export PDF Report</span>
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-800/60">
                {missingTeachersList.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                      ✓
                    </div>
                    <h3 className="font-bold text-white text-base">
                      100% Compliance Achieved!
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      All {deptTeachers.length} faculty members in{" "}
                      {selectedDept} have successfully submitted their reports
                      today.
                    </p>
                  </div>
                ) : (
                  missingTeachersList.map((t) => (
                    <div
                      key={t.id}
                      className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-sm">
                          ✕
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">
                              {t.name}
                            </span>
                            {t.isClassTeacher && (
                              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
                                Class Teacher
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            {t.subject} •{" "}
                            <span className="text-red-400 font-medium">
                              Status: Not Submitted Today
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          triggerAlert(
                            "Ping Sent",
                            `An immediate HOD notification ping was dispatched to ${t.name}.`,
                            "info",
                          )
                        }
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
          {activeTab === "submissions" && (
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl animate-[fadeInUp_0.3s_ease-out_forwards]">
              <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black text-white">
                    {selectedDept} Submissions Log ({filteredSubmissions.length}
                    )
                  </h2>
                  <p className="text-xs text-slate-400">
                    Detailed feed filtered by time period ({timeRange}). Click
                    any log to inspect answers or override score.
                  </p>
                </div>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Audit Trail Ready
                </span>
              </div>
              <div className="divide-y divide-slate-800/60">
                {filteredSubmissions.length === 0 ? (
                  <p className="p-8 text-center text-slate-500 text-sm">
                    No submissions found for the selected time range (
                    {timeRange}).
                  </p>
                ) : (
                  filteredSubmissions.map((log) => (
                    <div
                      key={log.id}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white text-base">
                            {log.teacherName}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              log.status === "Complete"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : log.status === "Overridden"
                                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20 font-extrabold"
                                  : log.status === "Rejected"
                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {log.status}
                          </span>
                          {log.isOverridden ? (
                            <span className="text-[10px] bg-purple-950 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-800">
                              ★ HOD Overridden
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                              ✓ Auto-Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {log.subject} • Logged on{" "}
                          <span className="text-slate-300 font-medium">
                            {log.rawDate} ({log.date})
                          </span>
                        </p>
                        {log.adminNotes ? (
                          <div className="mt-2 text-xs bg-purple-950/40 p-2.5 rounded-xl border border-purple-500/30 text-purple-200 flex items-start gap-2 max-w-xl">
                            <span className="text-purple-400">
                              🛡️ HOD Audit Note:
                            </span>
                            <span className="italic">"{log.adminNotes}"</span>
                          </div>
                        ) : log.notes ? (
                          <div className="mt-2 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-slate-300 flex items-start gap-2 max-w-xl">
                            <span className="text-slate-500">
                              💬 Teacher Remark:
                            </span>
                            <span className="italic">"{log.notes}"</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className="bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800 text-right shrink-0">
                          <div className="text-[10px] text-slate-500 uppercase font-bold">
                            Task Score
                          </div>
                          <div
                            className={`text-base font-black ${
                              log.status === "Rejected"
                                ? "text-red-400 line-through"
                                : log.isOverridden
                                  ? "text-purple-400"
                                  : "text-emerald-400"
                            }`}
                          >
                            {log.score}% Score
                          </div>
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

          {/* ================================================================= */}
          {/* REQUIREMENT 1: QUESTION STUDIO TAB */}
          {/* ================================================================= */}
          {activeTab === "questions" && (
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl animate-[fadeInUp_0.3s_ease-out_forwards]">
              <div className="p-6 border-b border-slate-800/80 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-black text-white">
                    ❓ Evaluation Question Studio
                  </h2>
                  <p className="text-xs text-slate-400">
                    Add, edit, or delete questions presented on the daily
                    teacher checklist.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddQuestion}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition"
                >
                  + Add New Question
                </button>
              </div>

              <div className="divide-y divide-slate-800/60">
                {questionsList.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-white text-base">
                            {q.text}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700 uppercase">
                            {q.type}
                          </span>
                          {q.group === "class_teacher" ? (
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                              Class Teacher Only
                            </span>
                          ) : (
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                              Common
                            </span>
                          )}
                          {q.day && q.day !== "Everyday" && (
                            <span className="text-[10px] bg-purple-500/10 text-purple-400 font-bold px-2 py-0.5 rounded-full border border-purple-500/20">
                              📅 {q.day}s Only
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          Weightage Value:{" "}
                          <span className="text-emerald-400 font-mono font-bold">
                            {q.points} Points
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleOpenEditQuestion(q)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700"
                      >
                        Edit ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 px-3 py-2 rounded-xl text-xs font-bold border border-slate-800 hover:border-red-500/30"
                      >
                        Delete ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* REQUIREMENT 2: ITEM-BY-ITEM RESPONSE BREAKDOWN TAB */}
          {/* ================================================================= */}
          {activeTab === "breakdown" && (
            <div className="space-y-6 animate-[fadeInUp_0.3s_ease-out_forwards]">
              <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <span>🎯 Item-by-Item Response Breakdown</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a checklist question below to isolate which faculty
                    members completed or missed that specific task.
                  </p>
                </div>

                <div className="w-full md:w-80">
                  <select
                    value={selectedBreakdownQuestionId}
                    onChange={(e) =>
                      setSelectedBreakdownQuestionId(e.target.value)
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-xs font-semibold focus:border-emerald-500 outline-none cursor-pointer"
                  >
                    {questionsList.map((q, i) => (
                      <option key={q.id} value={q.id}>
                        Q{i + 1}: {q.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Faculty Response Status ({filteredSubmissions.length}{" "}
                    Reports)
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">
                    Filtering: {timeRange}
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {filteredSubmissions.length === 0 ? (
                    <p className="p-8 text-center text-slate-500 text-sm">
                      No submissions recorded for this time range.
                    </p>
                  ) : (
                    filteredSubmissions.map((log) => {
                      const answer =
                        log.answers?.[selectedBreakdownQuestionId] ||
                        "No Response / N/A";
                      const isYes = answer === "Yes";
                      const isNo = answer === "No";

                      return (
                        <div
                          key={log.id}
                          className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-base">
                                {log.teacherName}
                              </span>
                              <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                                {log.department}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {log.subject} • Submitted on{" "}
                              <span className="text-slate-300 font-medium">
                                {log.rawDate} ({log.date})
                              </span>
                            </p>
                          </div>

                          <div className="shrink-0">
                            {isYes ? (
                              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm">
                                <span>✓ Task Completed (YES)</span>
                              </span>
                            ) : isNo ? (
                              <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm animate-pulse">
                                <span>✕ Task Missed (NO)</span>
                              </span>
                            ) : (
                              <div className="max-w-md bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono italic">
                                "{answer}"
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FACULTY DIRECTORY */}
          {activeTab === "faculty" && (
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl animate-[fadeInUp_0.3s_ease-out_forwards]">
              <div className="p-6 border-b border-slate-800/80 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-black text-white">
                    {selectedDept} Staff Directory
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage active faculty members.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition"
                >
                  + Add New Teacher
                </button>
              </div>
              <div className="divide-y divide-slate-800/60">
                {deptTeachers.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                        👤
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">
                            {t.name}
                          </span>
                          {t.isClassTeacher && (
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
                              Class Teacher
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {t.subject} •{" "}
                          <span className="text-emerald-400 font-semibold">
                            {t.department}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTeacher(t)}
                      className="text-xs font-bold bg-slate-950 hover:bg-red-500/10 text-slate-400 hover:text-red-400 px-3 py-2 rounded-xl border border-slate-800 hover:border-red-500/30 transition"
                    >
                      Remove ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="w-full text-center py-6 mt-auto text-xs text-slate-500 border-t border-slate-900/80">
          <p>EduMonitor System • HOD Evaluation Engine</p>
          <p className="mt-1 text-slate-400 font-medium tracking-wide">
            Powered by{" "}
            <span className="text-emerald-400 font-semibold">Code Craft</span> |
            6282811230
          </p>
        </footer>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chartRace {
          from { width: 0%; }
        }
      `,
        }}
      />
    </div>
  );
}
