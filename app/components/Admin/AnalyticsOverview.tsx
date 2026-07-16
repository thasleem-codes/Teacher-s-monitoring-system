import {
  DailyLogSubmission,
  Teacher,
  TeacherRanking,
  Question,
} from "../../data/mockData";

interface AnalyticsOverviewProps {
  avgScore: number;

  filteredSubmissions: DailyLogSubmission[];

  deptTeachers: Teacher[];

  missingTeachersList: Teacher[];

  filteredLeaderboard: TeacherRanking[];

  taskCompletionRates: {
    manual: number;
    classes: number;
    registry: number;
    total: number;
  };
  questionsList: Question[];
}

export default function AnalyticsOverview({
  avgScore,
  filteredSubmissions,
  deptTeachers,
  missingTeachersList,
  filteredLeaderboard,
  taskCompletionRates,
  questionsList,
}: AnalyticsOverviewProps) {
  return (
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
        <div className="bg-linear-to-br from-amber-500/10 via-slate-900 to-slate-900 p-6 rounded-3xl border border-amber-500/30">
          <div className="text-amber-400 text-xs font-bold uppercase mb-1 flex items-center gap-1.5">
            <span>👑</span>
            <span>Top Performer</span>
          </div>
          <div className="text-2xl font-black text-white truncate">
            {filteredLeaderboard[0]?.name || "No Data"}
          </div>
          <p className="text-xs text-amber-300/80 mt-2 font-semibold">
            Score: {filteredLeaderboard[0]?.monthlyScore || 0} / 100 • 14 Day
            Streak
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-white mb-1">
              Checklist Compliance Insights
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Automatically identifying high and low performance tasks.
            </p>

            <div className="space-y-6">
              {/* Dynamic logic to calculate compliance per question */}
              {questionsList.slice(0, 3).map((q) => {
                const total = filteredSubmissions.length || 1;

                const yesCount = filteredSubmissions.filter((s) => {

                  const val = s.answers[q.id];
                  if (!val) return false;

                  // 2. Normalize to string and lowercase for comparison
                  const normalizedVal = val.toString().toLowerCase();

                  // 3. Match if it starts with "yes" (covers "Yes", "yes", "Yes: 10A")
                  return normalizedVal.startsWith("yes");
                }).length;

                const percentage = Math.round((yesCount / total) * 100);
                return (
                  <div key={q.id}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-300 truncate max-w-[70%]">
                        {q.text}
                      </span>
                      <span
                        className={`${percentage < 50 ? "text-red-400" : "text-emerald-400"} font-mono`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full ${percentage < 50 ? "bg-red-500" : "bg-emerald-500"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Dynamic Analysis based on active questions</span>
            <span className="text-emerald-400 font-semibold">Live System</span>
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
                      <span className="text-white truncate">{t.name}</span>
                      <span className="text-emerald-400 font-mono">
                        {t.monthlyScore} / 100
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full animate-[chartRace_1s_ease-out_forwards] ${
                          t.rank === 1
                            ? "bg-linear-to-r from-amber-500 to-yellow-300"
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
  );
}
