"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Teacher,
  TeacherRanking,
  DailyLogSubmission,
  Question,
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
import AlertModal from "../components/Admin/AlertModal";
import SettingsModal from "../components/Admin/SettingsModal";
import AddTeacherModal from "../components/Admin/AddTeacherModal";
import QuestionModal from "../components/Admin/QuestionModal";
import ItemBreakdown from "../components/Admin/ItemBreakdown";
import FacultyDirectory from "../components/Admin/FacultyDirectory";
import QuestionStudio from "../components/Admin/QuestionStudio";
import SubmissionReport from "../components/Admin/SubmissionReport";
import DefaultersReport from "../components/Admin/DefaultersReport";
import AnalyticsOverview from "../components/Admin/AnalyticsOverview";
import Sidebar from "../components/Admin/Sidebar";
import AuditModal from "../components/Admin/AuditModal";
import LoginScreen from "../components/Admin/LoginScreen";

interface AlertModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
}

export default function AdminDashboard() {
  // ==========================================
  // STATE VARIABLES
  // ==========================================

  // Auth & Settings State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAppLoaded, setIsAppLoaded] = useState<boolean>(false); // Fixes Next.js hydration issues
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<boolean>(false);

  const [adminCreds, setAdminCreds] = useState({
    username: "admin",
    password: "admin123",
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

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
  const [leaderboardList, setLeaderboardList] = useState<TeacherRanking[]>([]);

  // ==========================================
  // INITIALIZATION & DATABASE LOADING
  // ==========================================

  // Load saved credentials securely on mount
  useEffect(() => {
    const savedCreds = localStorage.getItem("krhs_admin_creds");
    if (savedCreds) {
      setAdminCreds(JSON.parse(savedCreds));
    }
    setIsAppLoaded(true);
    loadAdminDatabase();
  }, []);

  const loadAdminDatabase = async () => {
    const [tData, sData, qData] = await Promise.all([
      getTeachers(),
      getSubmissions(),
      getQuestions(),
    ]);

    setTeachersList(tData);
    setSubmissionsList(sData);
    setQuestionsList(qData);

    // DYNAMIC LEADERBOARD CALCULATION
    const rankings = tData.map((teacher) => {
      const teacherLogs = sData.filter(
        (log: any) => log.teacherId === teacher.id,
      );
      const totalScore = teacherLogs.reduce(
        (acc: number, log: any) => acc + log.score,
        0,
      );
      const avgScore =
        teacherLogs.length > 0
          ? Math.round(totalScore / teacherLogs.length)
          : 0;

      return {
        teacherId: teacher.id,
        name: teacher.name,
        subject: (teacher as any).subject || "",
        department: teacher.department,
        monthlyScore: avgScore,
        streak: teacherLogs.length,
        tasksCompletedRate: 0,
        rank: 0,
      };
    });

    const sortedRankings = rankings
      .sort((a, b) => b.monthlyScore - a.monthlyScore)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    setLeaderboardList(sortedRankings);
  };

  const triggerAlert = (
    title: string,
    message: string,
    type: "success" | "warning" | "info" = "info",
  ) => {
    setCustomAlert({ isOpen: true, title, message, type });
  };

  const todayRaw = new Date().toISOString().split("T")[0];
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // ==========================================
  // SECURE AUTHENTICATION HANDLERS
  // ==========================================

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // SECURITY FIX: Removed the || usernameInput === "admin" backdoor
    if (
      usernameInput === adminCreds.username &&
      passwordInput === adminCreds.password
    ) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const newCreds = { username: newUsername, password: newPassword };

    // Save to state and persistent browser storage
    setAdminCreds(newCreds);
    localStorage.setItem("krhs_admin_creds", JSON.stringify(newCreds));
    setIsSettingsOpen(false);

    triggerAlert(
      "Settings Updated",
      `Admin credentials updated successfully! New Username: ${newUsername}`,
      "success",
    );
  };

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

  // ==========================================
  // DATABASE HANDLERS
  // ==========================================

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

  if (!isAppLoaded) return null; // Prevents hydration flicker

  if (!isAuthenticated) {
    return (
      <LoginScreen
        usernameInput={usernameInput}
        passwordInput={passwordInput}
        loginError={loginError}
        setUsernameInput={setUsernameInput}
        setPasswordInput={setPasswordInput}
        setLoginError={setLoginError}
        onSubmit={handleLogin}
      />
    );
  }

  // ==========================================
  // SCREEN 2: SIDEBAR COMMAND CENTER
  // ==========================================
  return (
    <div className="min-h-dvh flex bg-slate-950 text-white selection:bg-emerald-600">
      {/* Custom Alert Modal */}
      {customAlert.isOpen && (
        <AlertModal
          isOpen={customAlert.isOpen}
          title={customAlert.title}
          message={customAlert.message}
          type={customAlert.type}
          onClose={() =>
            setCustomAlert({
              ...customAlert,
              isOpen: false,
            })
          }
        />
      )}

      {/* QUESTION STUDIO MODAL */}
      {isQuestionModalOpen && (
        <QuestionModal
          isOpen={isQuestionModalOpen}
          editingQuestionId={editingQuestionId}
          questionForm={questionForm}
          setQuestionForm={setQuestionForm}
          onClose={() => setIsQuestionModalOpen(false)}
          onSubmit={handleSaveQuestion}
        />
      )}

      {/* Audit & Score Override Modal */}
      {selectedAuditLog && (
        <AuditModal
          selectedAuditLog={selectedAuditLog}
          questionsList={questionsList}
          overrideScore={overrideScore}
          setOverrideScore={setOverrideScore}
          overrideStatus={overrideStatus}
          setOverrideStatus={setOverrideStatus}
          adminAuditNote={adminAuditNote}
          setAdminAuditNote={setAdminAuditNote}
          onClose={() => setSelectedAuditLog(null)}
          onSubmit={handleSaveOverride}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          newUsername={newUsername}
          newPassword={newPassword}
          setNewUsername={setNewUsername}
          setNewPassword={setNewPassword}
          onClose={() => setIsSettingsOpen(false)}
          onSubmit={handleSaveCredentials}
        />
      )}

      {/* Add Faculty Modal */}
      {isAddModalOpen && (
        <AddTeacherModal
          isOpen={isAddModalOpen}
          newTeacherForm={newTeacherForm}
          setNewTeacherForm={setNewTeacherForm}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddTeacher}
        />
      )}

      {/* FIXED LEFT SIDEBAR NAVIGATION */}
      <Sidebar
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        missingCount={missingTeachersList.length}
        adminUsername={adminCreds.username}
        onOpenSettings={() => {
          setNewUsername(adminCreds.username);
          setNewPassword("");
          setIsSettingsOpen(true);
        }}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="lg:hidden w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md p-4 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/kite.png"
              alt="KRHS Logo"
              width={24}
              height={24}
              style={{ width: "auto", height: "auto" }}
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
            <AnalyticsOverview
              avgScore={avgScore}
              filteredSubmissions={filteredSubmissions}
              deptTeachers={deptTeachers}
              missingTeachersList={missingTeachersList}
              filteredLeaderboard={filteredLeaderboard}
              taskCompletionRates={taskCompletionRates}
            />
          )}

          {/* TAB 2: MISSING SUBMISSIONS TRACKER */}
          {activeTab === "defaulters" && (
            <DefaultersReport
              selectedDept={selectedDept}
              todayRaw={todayRaw}
              deptTeachers={deptTeachers}
              missingTeachersList={missingTeachersList}
              onExportPDF={handleExportPDF}
              onPingTeacher={(teacher) =>
                triggerAlert(
                  "Ping Sent",
                  `An immediate HOD notification ping was dispatched to ${teacher.name}.`,
                  "info",
                )
              }
            />
          )}

          {/* TAB 3: SUBMISSIONS REPORT */}
          {activeTab === "submissions" && (
            <SubmissionReport
              selectedDept={selectedDept}
              filteredSubmissions={filteredSubmissions}
              timeRange={timeRange}
              onInspect={handleOpenAuditModal}
            />
          )}

          {/* ================================================================= */}
          {/* REQUIREMENT 1: QUESTION STUDIO TAB */}
          {/* ================================================================= */}
          {activeTab === "questions" && (
            <QuestionStudio
              questionsList={questionsList}
              onAddQuestion={handleOpenAddQuestion}
              onEditQuestion={handleOpenEditQuestion}
              onDeleteQuestion={handleDeleteQuestion}
            />
          )}

          {/* ================================================================= */}
          {/* REQUIREMENT 2: ITEM-BY-ITEM RESPONSE BREAKDOWN TAB */}
          {/* ================================================================= */}
          {activeTab === "breakdown" && (
            <ItemBreakdown
              selectedBreakdownQuestionId={selectedBreakdownQuestionId}
              setSelectedBreakdownQuestionId={setSelectedBreakdownQuestionId}
              questionsList={questionsList}
              filteredSubmissions={filteredSubmissions}
              timeRange={timeRange}
            />
          )}

          {/* TAB 4: FACULTY DIRECTORY */}
          {activeTab === "faculty" && (
            <FacultyDirectory
              selectedDept={selectedDept}
              deptTeachers={deptTeachers}
              onAddTeacher={() => setIsAddModalOpen(true)}
              onDeleteTeacher={handleDeleteTeacher}
            />
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
