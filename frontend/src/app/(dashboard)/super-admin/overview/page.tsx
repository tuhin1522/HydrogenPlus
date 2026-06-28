"use client";

import { useEffect, useState } from "react";
import {
  getOverviewStats,
  getBranchAnalytics,
  getEnrollmentTrends,
  getSystemHealth,
} from "@/app/modules/super-admin/services/super-admin.service";

function StatCard({
  label,
  value,
  icon,
  sub,
  color = "#22C55E",
}: {
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-[#1C1917] bg-[#111010] p-5 hover:border-[#27272A] transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#71717A] font-medium uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[#F2F2F2]">{value}</p>
          {sub && <p className="mt-1 text-xs text-[#71717A]">{sub}</p>}
        </div>
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-xl border border-[#1C1917] bg-[#111010] p-5 animate-pulse">
      <div className="flex justify-between">
        <div>
          <div className="h-3 w-24 bg-[#1C1917] rounded mb-3" />
          <div className="h-8 w-16 bg-[#1C1917] rounded" />
        </div>
        <div className="h-10 w-10 bg-[#1C1917] rounded-xl" />
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [branchAnalytics, setBranchAnalytics] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        if (branchRes.status === "fulfilled") setBranchAnalytics(branchRes.value?.data || []);
        if (trendsRes.status === "fulfilled") setTrends(trendsRes.value?.data || []);
        if (healthRes.status === "fulfilled") setHealth(healthRes.value?.data);
      } catch (e) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Students", value: stats.totalStudents, icon: "🎓", color: "#22C55E" },
        { label: "Total Teachers", value: stats.totalTeachers, icon: "👩‍🏫", color: "#3B82F6" },
        { label: "Total Branches", value: stats.totalBranches, icon: "🏢", color: "#F59E0B" },
        { label: "Total Courses", value: stats.totalCourses, icon: "🎯", color: "#8B5CF6" },
        { label: "Total Batches", value: stats.totalBatches, icon: "📚", color: "#EC4899" },
        {
          label: "Total Revenue",
          value: `৳${(stats.totalRevenue || 0).toLocaleString()}`,
          icon: "💰",
          color: "#10B981",
        },
      ]
    : [];

  return (
    <div className="p-6 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#F2F2F2]">Platform Overview</h1>
        <p className="text-sm text-[#71717A] mt-1">Real-time metrics across all branches</p>
      </div>

      {error && (
        <div className="rounded-lg bg-[#EF4444]/5 border border-[#EF4444]/20 px-4 py-3 text-sm text-[#EF4444]">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)
          : statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
      </div>

      {/* System Health + Enrollment Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* System Health */}
        <div className="rounded-xl border border-[#1C1917] bg-[#111010] p-5">
          <h3 className="text-sm font-semibold text-[#F2F2F2] mb-4">System Health</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 bg-[#1C1917] rounded animate-pulse" />
              ))}
            </div>
          ) : health ? (
            <div className="space-y-3">
              {[
                { label: "Database", value: health.databaseStatus, ok: health.databaseStatus === "connected" },
                { label: "Server", value: health.serverStatus, ok: health.serverStatus === "healthy" },
                { label: "Active Branches", value: health.activeBranches },
                { label: "Unread Alerts", value: health.unreadNotifications },
              ].map(({ label, value, ok }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-[#71717A]">{label}</span>
                  <span
                    className={`font-medium ${
                      ok === true ? "text-[#22C55E]" : ok === false ? "text-[#EF4444]" : "text-[#F2F2F2]"
                    }`}
                  >
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#71717A]">No health data available.</p>
          )}
        </div>

        {/* Enrollment Trend */}
        <div className="rounded-xl border border-[#1C1917] bg-[#111010] p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-[#F2F2F2] mb-4">Enrollment Trends (Last 6 Months)</h3>
          {loading ? (
            <div className="h-32 bg-[#1C1917] rounded animate-pulse" />
          ) : trends.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-[#71717A]">
              No enrollment data yet.
            </div>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {(() => {
                const max = Math.max(...trends.map((t) => t.count), 1);
                return trends.map((t) => (
                  <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-[#22C55E] font-medium">{t.count}</span>
                    <div
                      className="w-full rounded-t bg-[#22C55E]/60 hover:bg-[#22C55E] transition-colors"
                      style={{ height: `${(t.count / max) * 100}%`, minHeight: "4px" }}
                    />
                    <span className="text-[9px] text-[#71717A]">{t.month.slice(5)}</span>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Branch Performance Table */}
      <div className="rounded-xl border border-[#1C1917] bg-[#111010] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1C1917]">
          <h3 className="text-sm font-semibold text-[#F2F2F2]">Branch Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1C1917] text-[#71717A] text-xs">
                <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Branch</th>
                <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Teachers</th>
                <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Batches</th>
                <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1917]">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 bg-[#1C1917] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : branchAnalytics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[#71717A]">
                    No branches found.
                  </td>
                </tr>
              ) : (
                branchAnalytics.map((branch) => (
                  <tr key={branch.id} className="hover:bg-[#1C1917]/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-[#F2F2F2]">{branch.name}</p>
                      <p className="text-xs text-[#71717A]">{branch.address}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          branch.status === "ACTIVE"
                            ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20"
                            : "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20"
                        }`}
                      >
                        {branch.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-[#F2F2F2] font-medium">{branch.teacherCount}</td>
                    <td className="px-5 py-3 text-right text-[#F2F2F2] font-medium">{branch.batchCount}</td>
                    <td className="px-5 py-3 text-right text-[#F2F2F2] font-medium">{branch.studentCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentStudents?.length > 0 && (
        <div className="rounded-xl border border-[#1C1917] bg-[#111010] p-5">
          <h3 className="text-sm font-semibold text-[#F2F2F2] mb-4">Recent Student Enrollments</h3>
          <div className="space-y-3">
            {stats.recentStudents.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-[#1C1917] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] text-xs font-bold">
                    {s.user?.name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F2F2F2]">{s.user?.name || "Unknown"}</p>
                    <p className="text-xs text-[#71717A]">{s.user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#71717A]">Batch: {s.batch?.name || "N/A"}</p>
                  <p className="text-xs text-[#71717A]">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
