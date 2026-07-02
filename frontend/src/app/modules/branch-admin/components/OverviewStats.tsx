"use client";

import Link from "next/link";
import { useBranchAdminDashboard } from "../hooks/use-branch-admin-dashboard";
import { branchAdminDashboardSchema } from "../validation/branch-admin.validation";

export function OverviewStats() {
  const { data, loading, error } = useBranchAdminDashboard();

  const validatedData = data ? branchAdminDashboardSchema.parse(data) : null;
  const stats = validatedData?.stats;
  const recentAdmissions = validatedData?.recentAdmissions ?? [];
  const recentPayments = validatedData?.recentPayments ?? [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error || "Unable to load branch admin dashboard."}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back to the branch admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon="🎓" trend="+5%" />
        <StatCard title="Total Teachers" value={stats.totalTeachers} icon="👩‍🏫" />
        <StatCard title="Total Batches" value={stats.totalBatches} icon="👥" />
        <StatCard title="Active Courses" value={stats.activeCourses} icon="🎯" />
        <StatCard title="Today's Classes" value={stats.todaysClasses} icon="🗓️" />
        <StatCard title="Monthly Revenue" value={stats.monthlyRevenue} icon="💰" trend="+12%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Student Admission Trend</h3>
            <div className="h-64 w-full bg-muted/30 rounded-lg border border-border flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Line Chart Placeholder (Recharts)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Students by Class</h3>
              <div className="h-48 w-full bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Pie Chart Placeholder</span>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Batch-wise Distribution</h3>
              <div className="h-48 w-full bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Bar Chart Placeholder</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Admissions</h3>
              <Link href="/branch-admin/students" className="text-xs text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentAdmissions.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Payments</h3>
              <Link href="/branch-admin/payments" className="text-xs text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentPayments.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-xs">
                    💰
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">Course Fee</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string | number; icon: string; trend?: string }) {
  return (
    <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase">{title}</p>
        <span className="text-xl opacity-80">{icon}</span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {trend && (
          <span className="text-xs font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{trend}</span>
        )}
      </div>
    </div>
  );
}
