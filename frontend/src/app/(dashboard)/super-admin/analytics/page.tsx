"use client";

import { useEffect, useState } from "react";
import {
  getOverviewStats,
  getBranchAnalytics,
  getSystemHealth,
} from "@/app/modules/super-admin/services/super-admin.service";

const MOCK_REVENUE = [45000, 62000, 51000, 78000, 95000, 88000, 112000, 130000, 115000, 145000, 128000, 160000];
const MOCK_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MOCK_STUDENT_GROWTH = [120, 145, 162, 180, 210, 245, 278, 310, 345, 390, 412, 460];
const MOCK_COURSE_PERF = [
  { name: "Physics Adv.", score: 88, color: "#22C55E" },
  { name: "Chemistry Pro", score: 74, color: "#3B82F6" },
  { name: "Higher Math", score: 92, color: "#8B5CF6" },
  { name: "Biology", score: 65, color: "#F59E0B" },
  { name: "English", score: 79, color: "#EC4899" },
];
const MOCK_TEACHERS = [
  { name: "Dr. Rahman", rating: 4.8, students: 210, completion: 95 },
  { name: "Ms. Akter", rating: 4.6, students: 185, completion: 88 },
  { name: "Mr. Hasan", rating: 4.3, students: 162, completion: 82 },
  { name: "Dr. Islam", rating: 4.9, students: 240, completion: 97 },
];

type TimeRange = "3M" | "6M" | "1Y";
type AnalyticsStats = {
  totalStudents?: number;
  totalTeachers?: number;
  totalBranches?: number;
  totalCourses?: number;
  totalBatches?: number;
};
type BranchItem = {
  id: string;
  name: string;
  studentCount?: number;
};
type SystemHealth = {
  totalUsers?: number;
  activeBranches?: number;
  serverStatus?: string;
  databaseStatus?: string;
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");
  const [activeChart, setActiveChart] = useState<"revenue" | "students">("revenue");

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, branchRes, healthRes] = await Promise.allSettled([
          getOverviewStats(),
          getBranchAnalytics(),
          getSystemHealth(),
        ]);
        if (statsRes.status === "fulfilled") setStats(statsRes.value?.data);
        if (branchRes.status === "fulfilled") setBranches(branchRes.value?.data || []);
        if (healthRes.status === "fulfilled") setHealth(healthRes.value?.data);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const rangeSlice = timeRange === "3M" ? 3 : timeRange === "6M" ? 6 : 12;
  const revenueData = MOCK_REVENUE.slice(-rangeSlice);
  const studentData = MOCK_STUDENT_GROWTH.slice(-rangeSlice);
  const monthData = MOCK_MONTHS.slice(-rangeSlice);
  const chartData = activeChart === "revenue" ? revenueData : studentData;
  const maxVal = Math.max(...chartData, 1);

  const totalRevenue = revenueData.reduce((a, b) => a + b, 0);
  const revenueGrowth = Math.round(((revenueData[revenueData.length - 1] - revenueData[0]) / revenueData[0]) * 100);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Advanced Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Platform-wide insights, trends, and performance metrics.</p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          {(["3M", "6M", "1Y"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`rounded px-4 py-1.5 text-xs font-bold transition ${timeRange === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Students", value: stats?.totalStudents ?? 460, change: "+18%", color: "text-emerald-600" },
          { label: "Teachers", value: stats?.totalTeachers ?? 38, change: "+5%", color: "text-blue-600" },
          { label: "Branches", value: stats?.totalBranches ?? 6, change: "+1", color: "text-violet-600" },
          { label: "Courses", value: stats?.totalCourses ?? 24, change: "+4", color: "text-amber-600" },
          { label: "Batches", value: stats?.totalBatches ?? 18, change: "+2", color: "text-pink-600" },
          { label: "Revenue", value: `৳${Math.round(totalRevenue / 1000)}k`, change: `+${revenueGrowth}%`, color: "text-teal-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 transition hover:border-primary/40" style={{ borderColor: s.color.replace("text-", "") === "emerald-600" ? "#10b98133" : undefined }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className={`mt-1 text-2xl font-black ${s.color}`}>{loading ? "—" : s.value}</p>
            <p className={`mt-1 text-[10px] ${s.color}`}>{s.change} ↑</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-foreground">
              {activeChart === "revenue" ? "Revenue Analytics" : "Student Growth"} — Last {timeRange}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {activeChart === "revenue"
                ? `Total: ৳${totalRevenue.toLocaleString()} · Growth: +${revenueGrowth}%`
                : `Peak: ${Math.max(...studentData)} students · Net added: +${studentData[studentData.length - 1] - studentData[0]}`}
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { key: "revenue", label: "📈 Revenue" },
              { key: "students", label: "🎓 Students" },
            ].map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveChart(c.key as "revenue" | "students")}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${activeChart === c.key ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex h-48 items-end gap-2">
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            {[100, 75, 50, 25, 0].map((pct) => (
              <div key={pct} className="flex items-center border-b border-border/50">
                <span className="-mt-2 w-8 text-[9px] text-muted-foreground/70">
                  {pct > 0 ? Math.round((maxVal * pct) / 100 / (activeChart === "revenue" ? 1000 : 1)) + (activeChart === "revenue" ? "k" : "") : ""}
                </span>
              </div>
            ))}
          </div>
          <div className="flex h-full w-full items-end gap-2 pl-8">
            {chartData.map((v, i) => {
              const pct = (v / maxVal) * 100;
              const isLast = i === chartData.length - 1;
              return (
                <div key={i} className="group flex flex-1 flex-col items-center justify-end gap-1.5">
                  <span className="text-[9px] text-muted-foreground opacity-0 transition group-hover:opacity-100">
                    {activeChart === "revenue" ? `৳${Math.round(v / 1000)}k` : v}
                  </span>
                  <div
                    className="relative w-full overflow-hidden rounded-t transition-all duration-500"
                    style={{
                      height: `${pct}%`,
                      minHeight: 4,
                      background: isLast ? "linear-gradient(to top, #22C55E, #86EFAC)" : "linear-gradient(to top, #22C55E50, #22C55E30)",
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: "linear-gradient(to top, #22C55E, #86EFAC)" }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground">{monthData[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-1 font-bold text-foreground">Course Performance</h2>
          <p className="mb-5 text-xs text-muted-foreground">Average exam score per course</p>
          <div className="space-y-4">
            {MOCK_COURSE_PERF.map((c) => (
              <div key={c.name}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="font-bold" style={{ color: c.color }}>{c.score}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.score}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-1 font-bold text-foreground">Teacher Effectiveness</h2>
          <p className="mb-5 text-xs text-muted-foreground">Rating, students, and course completion</p>
          <div className="space-y-3">
            {MOCK_TEACHERS.map((t) => (
              <div key={t.name} className="flex items-center gap-3 rounded-xl border border-border bg-background/70 p-3 transition hover:border-primary/30">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 text-sm font-bold text-emerald-600">
                  {t.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{t.students} students</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-amber-600">⭐ {t.rating}</p>
                  <p className="text-[10px] text-emerald-600">{t.completion}% done</p>
                </div>
                <div className="w-10">
                  <div className="h-1.5 rounded-full bg-muted/40">
                    <div className="h-full rounded-full bg-emerald-600" style={{ width: `${t.completion}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-1 font-bold text-foreground">Branch Comparison</h2>
        <p className="mb-5 text-xs text-muted-foreground">Student distribution across all branches</p>
        {branches.length === 0 ? (
          <div className="flex h-36 items-end gap-3">
            {['Dhaka', 'Ctg', 'Sylhet', 'Khulna', 'Rajshahi'].map((name, i) => {
              const heights = [85, 60, 45, 70, 55];
              const colors = ["#22C55E", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899"];
              return (
                <div key={name} className="group flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t opacity-80 transition-all duration-500 group-hover:opacity-100" style={{ height: `${heights[i]}%`, background: colors[i], minHeight: 8 }} />
                  <span className="text-[10px] text-muted-foreground">{name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {branches.map((b) => (
              <div key={b.id} className="flex items-center gap-3">
                <p className="w-32 truncate text-xs text-muted-foreground">{b.name}</p>
                <div className="h-5 flex-1 overflow-hidden rounded bg-muted/40">
                  <div className="flex h-full items-center rounded bg-blue-600 px-2" style={{ width: `${Math.min(((b.studentCount ?? 0) / 400) * 100, 100)}%` }}>
                    <span className="text-[9px] text-white/80">{b.studentCount ?? 0}</span>
                  </div>
                </div>
                <span className="w-16 text-right text-xs text-muted-foreground">{b.studentCount ?? 0} students</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {health && (
        <div className="rounded-2xl border border-primary/20 bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
            <h2 className="font-bold text-foreground">System Health</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Total Users", val: health.totalUsers, color: "text-blue-600" },
              { label: "Active Branches", val: health.activeBranches, color: "text-emerald-600" },
              { label: "Server", val: health.serverStatus, color: "text-emerald-600" },
              { label: "Database", val: health.databaseStatus, color: "text-emerald-600" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-background/70 p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`mt-1 text-lg font-bold capitalize ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
