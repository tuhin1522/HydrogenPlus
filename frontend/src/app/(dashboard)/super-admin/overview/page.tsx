"use client";

import { useEffect, useState } from "react";
import {
  getOverviewStats,
  getBranchAnalytics,
  getEnrollmentTrends,
  getSystemHealth,
} from "@/app/modules/super-admin/services/super-admin.service";

type RecentStudent = {
  id: string | number;
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
  batch?: {
    name?: string;
  };
};

type OverviewStats = {
  totalStudents?: number;
  totalTeachers?: number;
  totalBranches?: number;
  totalCourses?: number;
  totalBatches?: number;
  totalRevenue?: number;
  recentStudents?: RecentStudent[];
};

type BranchAnalytics = {
  id: string | number;
  name: string;
  address?: string;
  status?: string;
  teacherCount?: number;
  batchCount?: number;
  studentCount?: number;
};

type EnrollmentTrend = {
  month: string;
  count: number;
};

type SystemHealth = {
  databaseStatus?: string;
  serverStatus?: string;
  activeBranches?: number;
  unreadNotifications?: number;
};

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
    <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
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
    <div className="animate-pulse rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
      <div className="flex justify-between">
        <div>
          <div className="mb-3 h-3 w-24 rounded bg-muted" />
          <div className="h-8 w-16 rounded bg-muted" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [branchAnalytics, setBranchAnalytics] = useState<BranchAnalytics[]>([]);
  const [trends, setTrends] = useState<EnrollmentTrend[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
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
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Students", value: stats.totalStudents ?? 0, icon: "🎓", color: "#22C55E" },
        { label: "Total Teachers", value: stats.totalTeachers ?? 0, icon: "👩‍🏫", color: "#3B82F6" },
        { label: "Total Branches", value: stats.totalBranches ?? 0, icon: "🏢", color: "#F59E0B" },
        { label: "Total Courses", value: stats.totalCourses ?? 0, icon: "🎯", color: "#8B5CF6" },
        { label: "Total Batches", value: stats.totalBatches ?? 0, icon: "📚", color: "#EC4899" },
        {
          label: "Total Revenue",
          value: `৳${(stats.totalRevenue || 0).toLocaleString()}`,
          icon: "💰",
          color: "#10B981",
        },
      ]
    : [];

  return (
    <div className="min-h-full space-y-8 bg-background px-6 py-6 text-foreground">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time metrics across all branches</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            Live overview
          </span>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            All branches
          </span>
          <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            Updated today
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <LoadingCard key={i} />)
          : statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
      </div>

      {/* System Health + Enrollment Trends */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">System Health</h3>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 animate-pulse rounded bg-muted" />
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
                <div key={label} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span
                    className={`font-medium ${
                      ok === true ? "text-emerald-600" : ok === false ? "text-red-600" : "text-foreground"
                    }`}
                  >
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No health data available.</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Enrollment Trends (Last 6 Months)</h3>
          {loading ? (
            <div className="h-32 animate-pulse rounded bg-muted" />
          ) : trends.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No enrollment data yet.
            </div>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {(() => {
                const max = Math.max(...trends.map((t) => t.count), 1);
                return trends.map((t) => (
                  <div key={t.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-primary">{t.count}</span>
                    <div
                      className="w-full rounded-t bg-primary/70 transition-colors hover:bg-primary"
                      style={{ height: `${(t.count / max) * 100}%`, minHeight: "4px" }}
                    />
                    <span className="text-[9px] text-muted-foreground">{t.month.slice(5)}</span>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Branch Performance Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card/95 shadow-sm">
        <div className="border-b border-border bg-muted/20 px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Branch Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Branch</th>
                <th className="px-5 py-3 text-left font-medium uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Teachers</th>
                <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Batches</th>
                <th className="px-5 py-3 text-right font-medium uppercase tracking-wider">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : branchAnalytics.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    No branches found.
                  </td>
                </tr>
              ) : (
                branchAnalytics.map((branch) => (
                  <tr key={branch.id} className="transition-colors odd:bg-background/70 even:bg-muted/20 hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <p className="font-medium text-foreground">{branch.name}</p>
                      <p className="text-xs text-muted-foreground">{branch.address}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                          branch.status === "ACTIVE"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                            : "border-red-500/20 bg-red-500/10 text-red-600"
                        }`}
                      >
                        {branch.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-foreground">{branch.teacherCount}</td>
                    <td className="px-5 py-3 text-right font-medium text-foreground">{branch.batchCount}</td>
                    <td className="px-5 py-3 text-right font-medium text-foreground">{branch.studentCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      {(stats?.recentStudents?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Recent Student Enrollments</h3>
          <div className="space-y-3">
            {(stats?.recentStudents ?? []).map((s: RecentStudent) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-border/70 bg-background/70 px-3 py-3 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs font-bold text-emerald-600">
                    {s.user?.name?.charAt(0) || "S"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.user?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{s.user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Batch: {s.batch?.name || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
