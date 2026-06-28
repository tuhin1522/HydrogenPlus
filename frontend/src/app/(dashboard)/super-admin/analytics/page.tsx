"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getOverviewStats,
  getBranchAnalytics,
  getEnrollmentTrends,
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

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");
  const [activeChart, setActiveChart] = useState<"revenue" | "students">("revenue");

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, branchRes, trendsRes, healthRes] = await Promise.allSettled([
          getOverviewStats(),
          getBranchAnalytics(),
          getEnrollmentTrends(),
          getSystemHealth(),
        ]);
        if (statsRes.status === "fulfilled") setStats(statsRes.value?.data);
        if (branchRes.status === "fulfilled") setBranches(branchRes.value?.data || []);
        if (trendsRes.status === "fulfilled") setTrends(trendsRes.value?.data || []);
        if (healthRes.status === "fulfilled") setHealth(healthRes.value?.data);
      } finally { setLoading(false); }
    };
    load();
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F2F2F2]">Advanced Analytics</h1>
          <p className="text-sm text-[#71717A] mt-1">Platform-wide insights, trends, and performance metrics.</p>
        </div>
        <div className="flex gap-1 bg-[#111010] border border-[#1C1917] rounded-lg p-1">
          {(["3M", "6M", "1Y"] as TimeRange[]).map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              className={`px-4 py-1.5 text-xs font-bold rounded transition ${timeRange === r ? "bg-[#22C55E] text-[#052E16]" : "text-[#71717A] hover:text-[#F2F2F2]"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Students", value: stats?.totalStudents ?? 460, change: "+18%", color: "#22C55E" },
          { label: "Teachers", value: stats?.totalTeachers ?? 38, change: "+5%", color: "#3B82F6" },
          { label: "Branches", value: stats?.totalBranches ?? 6, change: "+1", color: "#8B5CF6" },
          { label: "Courses", value: stats?.totalCourses ?? 24, change: "+4", color: "#F59E0B" },
          { label: "Batches", value: stats?.totalBatches ?? 18, change: "+2", color: "#EC4899" },
          { label: "Revenue", value: `৳${Math.round(totalRevenue / 1000)}k`, change: `+${revenueGrowth}%`, color: "#14B8A6" },
        ].map((s) => (
          <div key={s.label} className="bg-[#111010] border border-[#1C1917] rounded-xl p-4 hover:border-opacity-50 transition group" style={{ borderColor: s.color + "33" }}>
            <p className="text-[10px] text-[#71717A] uppercase tracking-wider font-semibold">{s.label}</p>
            <p className="mt-1 text-2xl font-black" style={{ color: s.color }}>{loading ? "—" : s.value}</p>
            <p className="text-[10px] mt-1" style={{ color: s.color }}>{s.change} ↑</p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-[#111010] border border-[#1C1917] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-[#F2F2F2] text-base">
              {activeChart === "revenue" ? "Revenue Analytics" : "Student Growth"} — Last {timeRange}
            </h2>
            <p className="text-xs text-[#71717A] mt-0.5">
              {activeChart === "revenue"
                ? `Total: ৳${totalRevenue.toLocaleString()} · Growth: +${revenueGrowth}%`
                : `Peak: ${Math.max(...studentData)} students · Net added: +${studentData[studentData.length - 1] - studentData[0]}`}
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { key: "revenue", label: "📈 Revenue" },
              { key: "students", label: "🎓 Students" },
            ].map(c => (
              <button key={c.key} onClick={() => setActiveChart(c.key as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${activeChart === c.key ? "bg-[#22C55E]/10 border-[#22C55E]/40 text-[#22C55E]" : "border-[#1C1917] text-[#71717A] hover:text-[#F2F2F2]"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end gap-2 h-48 relative">
          {/* Y-axis guide lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[100, 75, 50, 25, 0].map(pct => (
              <div key={pct} className="border-b border-[#1C1917]/50 flex items-center">
                <span className="text-[9px] text-[#71717A]/50 w-8 -mt-2">
                  {pct > 0 ? Math.round((maxVal * pct) / 100 / (activeChart === "revenue" ? 1000 : 1)) + (activeChart === "revenue" ? "k" : "") : ""}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-2 h-full w-full pl-8">
            {chartData.map((v, i) => {
              const pct = (v / maxVal) * 100;
              const isLast = i === chartData.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 group">
                  <span className="text-[9px] text-[#71717A] opacity-0 group-hover:opacity-100 transition">
                    {activeChart === "revenue" ? `৳${Math.round(v / 1000)}k` : v}
                  </span>
                  <div className="w-full rounded-t transition-all duration-500 relative overflow-hidden"
                    style={{
                      height: `${pct}%`,
                      minHeight: 4,
                      background: isLast
                        ? "linear-gradient(to top, #22C55E, #86EFAC)"
                        : "linear-gradient(to top, #22C55E50, #22C55E30)"
                    }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                      style={{ background: "linear-gradient(to top, #22C55E, #86EFAC)" }} />
                  </div>
                  <span className="text-[9px] text-[#71717A]">{monthData[i]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Course Performance + Teacher Effectiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <div className="bg-[#111010] border border-[#1C1917] rounded-2xl p-6">
          <h2 className="font-bold text-[#F2F2F2] mb-1">Course Performance</h2>
          <p className="text-xs text-[#71717A] mb-5">Average exam score per course</p>
          <div className="space-y-4">
            {MOCK_COURSE_PERF.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#F2F2F2] font-medium">{c.name}</span>
                  <span className="font-bold" style={{ color: c.color }}>{c.score}%</span>
                </div>
                <div className="h-2 bg-[#1C1917] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${c.score}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Effectiveness */}
        <div className="bg-[#111010] border border-[#1C1917] rounded-2xl p-6">
          <h2 className="font-bold text-[#F2F2F2] mb-1">Teacher Effectiveness</h2>
          <p className="text-xs text-[#71717A] mb-5">Rating, students, and course completion</p>
          <div className="space-y-3">
            {MOCK_TEACHERS.map((t, i) => (
              <div key={t.name} className="flex items-center gap-3 p-3 bg-[#0D0B0A] border border-[#1C1917] rounded-xl hover:border-[#27272A] transition">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#22C55E]/20 to-[#3B82F6]/20 flex items-center justify-center text-sm font-bold text-[#22C55E] shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#F2F2F2] truncate">{t.name}</p>
                  <p className="text-[10px] text-[#71717A]">{t.students} students</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#F59E0B]">⭐ {t.rating}</p>
                  <p className="text-[10px] text-[#22C55E]">{t.completion}% done</p>
                </div>
                <div className="w-10">
                  <div className="h-1.5 bg-[#1C1917] rounded-full">
                    <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${t.completion}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Comparison */}
      <div className="bg-[#111010] border border-[#1C1917] rounded-2xl p-6">
        <h2 className="font-bold text-[#F2F2F2] mb-1">Branch Comparison</h2>
        <p className="text-xs text-[#71717A] mb-5">Student distribution across all branches</p>
        {branches.length === 0 ? (
          <div className="flex items-end gap-3 h-36">
            {["Dhaka", "Ctg", "Sylhet", "Khulna", "Rajshahi"].map((name, i) => {
              const heights = [85, 60, 45, 70, 55];
              const colors = ["#22C55E", "#3B82F6", "#8B5CF6", "#F59E0B", "#EC4899"];
              return (
                <div key={name} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full rounded-t transition-all duration-500 group-hover:opacity-100 opacity-80"
                    style={{ height: `${heights[i]}%`, background: colors[i], minHeight: 8 }} />
                  <span className="text-[10px] text-[#71717A]">{name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {branches.map((b: any) => (
              <div key={b.id} className="flex items-center gap-3">
                <p className="text-xs text-[#A1A1AA] w-32 truncate">{b.name}</p>
                <div className="flex-1 h-5 bg-[#1C1917] rounded overflow-hidden">
                  <div className="h-full bg-[#3B82F6] rounded flex items-center px-2"
                    style={{ width: `${Math.min((b.studentCount / 400) * 100, 100)}%` }}>
                    <span className="text-[9px] text-white/70">{b.studentCount}</span>
                  </div>
                </div>
                <span className="text-xs text-[#71717A] w-16 text-right">{b.studentCount} students</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Health */}
      {health && (
        <div className="bg-[#111010] border border-[#22C55E]/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <h2 className="font-bold text-[#F2F2F2]">System Health</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Users", val: health.totalUsers, color: "#3B82F6" },
              { label: "Active Branches", val: health.activeBranches, color: "#22C55E" },
              { label: "Server", val: health.serverStatus, color: "#22C55E" },
              { label: "Database", val: health.databaseStatus, color: "#22C55E" },
            ].map(s => (
              <div key={s.label} className="bg-[#0D0B0A] border border-[#1C1917] rounded-xl p-4">
                <p className="text-xs text-[#71717A]">{s.label}</p>
                <p className="text-lg font-bold capitalize mt-1" style={{ color: s.color }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
