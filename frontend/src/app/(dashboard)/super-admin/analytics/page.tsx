"use client";

import { useEffect, useState } from "react";
import {
  getOverviewStats,
  getBranchAnalytics,
  getEnrollmentTrends,
  getSystemHealth,
} from "@/app/modules/super-admin/services/super-admin.service";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maxTrend = Math.max(...trends.map((t) => t.count), 1);
  const maxStudents = Math.max(...branches.map((b) => b.studentCount), 1);

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl border border-[#1C1917] bg-[#111010] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#F2F2F2]">Analytics</h1>
        <p className="text-sm text-[#71717A] mt-1">Platform-wide metrics and performance insights</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Students", value: stats?.totalStudents ?? 0, color: "#22C55E" },
          { label: "Teachers", value: stats?.totalTeachers ?? 0, color: "#3B82F6" },
          { label: "Branches", value: stats?.totalBranches ?? 0, color: "#A855F7" },
          { label: "Courses", value: stats?.totalCourses ?? 0, color: "#F59E0B" },
          { label: "Batches", value: stats?.totalBatches ?? 0, color: "#EC4899" },
          { label: "Revenue", value: `৳${(stats?.totalRevenue ?? 0).toLocaleString()}`, color: "#14B8A6" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[#1C1917] bg-[#111010] p-4">
            <p className="text-xs text-[#71717A] uppercase">{s.label}</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#1C1917] bg-[#111010] p-6">
          <h2 className="font-bold text-[#F2F2F2] mb-4">Enrollment Trends (6 months)</h2>
          {trends.length === 0 ? (
            <p className="text-[#71717A] text-sm">No enrollment data yet.</p>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {trends.map((t) => (
                <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-[#71717A]">{t.count}</span>
                  <div className="w-full rounded-t bg-[#22C55E]/80" style={{ height: `${(t.count / maxTrend) * 100}%`, minHeight: 4 }} />
                  <span className="text-[10px] text-[#71717A]">{t.month.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#1C1917] bg-[#111010] p-6">
          <h2 className="font-bold text-[#F2F2F2] mb-4">Branch Comparison (Students)</h2>
          {branches.length === 0 ? (
            <p className="text-[#71717A] text-sm">No branch data yet.</p>
          ) : (
            <div className="space-y-3">
              {branches.map((b) => (
                <div key={b.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#F2F2F2]">{b.name}</span>
                    <span className="text-[#71717A]">{b.studentCount} students</span>
                  </div>
                  <div className="h-2 bg-[#1C1917] rounded-full overflow-hidden">
                    <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${(b.studentCount / maxStudents) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[#1C1917] bg-[#111010] p-6">
        <h2 className="font-bold text-[#F2F2F2] mb-4">Teacher Distribution by Branch</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {branches.map((b) => (
            <div key={b.id} className="bg-[#0D0B0A] border border-[#1C1917] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#A855F7]">{b.teacherCount}</p>
              <p className="text-xs text-[#71717A] mt-1">{b.name}</p>
            </div>
          ))}
        </div>
      </div>

      {health && (
        <div className="rounded-xl border border-[#1C1917] bg-[#111010] p-6">
          <h2 className="font-bold text-[#F2F2F2] mb-4">System Health</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-[#71717A] block">Total Users</span><span className="text-[#F2F2F2] font-bold">{health.totalUsers}</span></div>
            <div><span className="text-[#71717A] block">Active Branches</span><span className="text-[#22C55E] font-bold">{health.activeBranches}</span></div>
            <div><span className="text-[#71717A] block">Server</span><span className="text-[#22C55E] font-bold capitalize">{health.serverStatus}</span></div>
            <div><span className="text-[#71717A] block">Database</span><span className="text-[#22C55E] font-bold capitalize">{health.databaseStatus}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
