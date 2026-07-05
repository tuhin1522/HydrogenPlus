"use client";

import Link from "next/link";
import { useBranchAdminDashboard } from "../hooks/use-branch-admin-dashboard";
import { branchAdminDashboardSchema } from "../validation/branch-admin.validation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Wallet,
  ArrowUpRight,
  UserPlus
} from "lucide-react";

const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const MOCK_LINE_DATA = [
  { name: "Jan", admissions: 40 },
  { name: "Feb", admissions: 30 },
  { name: "Mar", admissions: 20 },
  { name: "Apr", admissions: 27 },
  { name: "May", admissions: 18 },
  { name: "Jun", admissions: 23 },
  { name: "Jul", admissions: 34 },
];

const MOCK_PIE_DATA = [
  { name: "Class 9", value: 400 },
  { name: "Class 10", value: 300 },
  { name: "Class 11", value: 300 },
  { name: "Class 12", value: 200 },
];

const MOCK_BAR_DATA = [
  { name: "Morning", students: 120 },
  { name: "Afternoon", students: 90 },
  { name: "Evening", students: 150 },
];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive font-medium flex items-center gap-2">
          <span>⚠️</span> {error || "Unable to load branch admin dashboard."}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          Branch Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-medium">Welcome back, Admin. Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<GraduationCap className="w-5 h-5" />} trend="+5%" color="bg-blue-500/10 text-blue-500" />
        <StatCard title="Total Teachers" value={stats.totalTeachers} icon={<Users className="w-5 h-5" />} color="bg-purple-500/10 text-purple-500" />
        <StatCard title="Total Batches" value={stats.totalBatches} icon={<UserPlus className="w-5 h-5" />} color="bg-pink-500/10 text-pink-500" />
        <StatCard title="Active Courses" value={stats.activeCourses} icon={<BookOpen className="w-5 h-5" />} color="bg-emerald-500/10 text-emerald-500" />
        <StatCard title="Today's Classes" value={stats.todaysClasses} icon={<Calendar className="w-5 h-5" />} color="bg-amber-500/10 text-amber-500" />
        <StatCard title="Monthly Revenue" value={stats.monthlyRevenue} icon={<Wallet className="w-5 h-5" />} trend="+12%" color="bg-rose-500/10 text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Student Admission Trend
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_LINE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="admissions" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Students by Class
              </h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={MOCK_PIE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {MOCK_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #333' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Batch-wise Distribution
              </h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_BAR_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #333' }} />
                    <Bar dataKey="students" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Recent Admissions
              </h3>
              <Link href="/branch-admin/students" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-5">
              {recentAdmissions.map((item) => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-sm font-bold shadow-inner group-hover:scale-105 transition-transform">
                    {item.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">{item.details}</p>
                  </div>
                </div>
              ))}
              {recentAdmissions.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">No recent admissions</div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Recent Payments
              </h3>
              <Link href="/branch-admin/payments" className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                View All <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-5">
              {recentPayments.map((item) => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-105 transition-transform">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground font-medium">Course Fee</p>
                  </div>
                  <span className="text-sm font-bold text-foreground bg-secondary px-2 py-1 rounded-md">{item.amount}</span>
                </div>
              ))}
              {recentPayments.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">No recent payments</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color = "bg-primary/10 text-primary" }: { title: string; value: string | number; icon: React.ReactNode; trend?: string; color?: string }) {
  return (
    <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-muted-foreground">{title}</p>
        <div className={`p-2 rounded-xl ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-3xl font-black tracking-tight text-foreground">{value}</p>
        {trend && (
          <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{trend}</span>
        )}
      </div>
    </div>
  );
}
