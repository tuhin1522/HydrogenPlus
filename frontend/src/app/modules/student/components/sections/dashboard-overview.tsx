"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { studentService, type StudentDashboardOverview } from "@/app/modules/students/services/student.service";

const metricMeta: Array<{ key: keyof StudentDashboardOverview["stats"]; label: string; accent: string }> = [
  { key: "currentClass", label: "Current Class", accent: "from-sky-500 to-cyan-400" },
  { key: "currentBatch", label: "Current Batch", accent: "from-violet-500 to-fuchsia-400" },
  { key: "enrolledCourses", label: "Enrolled Courses", accent: "from-emerald-500 to-green-400" },
  { key: "upcomingExams", label: "Upcoming Exams", accent: "from-amber-500 to-orange-400" },
  { key: "completedExams", label: "Completed Exams", accent: "from-rose-500 to-pink-400" },
  { key: "attendancePercentage", label: "Attendance %", accent: "from-blue-500 to-indigo-400" },
];

export function DashboardOverview() {
  const [data, setData] = useState<StudentDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await studentService.getDashboardOverview();
      setData(result);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-3xl border border-border/70 bg-card/80" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metricMeta.map((metric) => (
          <div key={metric.key} className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">
            <div className={`h-1.5 rounded-full bg-gradient-to-r ${metric.accent}`} />
            <p className="mt-4 text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{data.stats[metric.key]}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Subject-wise performance</h3>
                <p className="text-sm text-muted-foreground">A quick snapshot of your academic momentum.</p>
              </div>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Updated today
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {data.performance.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.label}</span>
                    <span className="text-muted-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Upcoming classes</h3>
                <p className="text-sm text-muted-foreground">Stay ready for your next live session.</p>
              </div>
              <Link href="/student/routine" className="text-sm font-medium text-primary transition hover:opacity-80">
                View routine
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {data.upcomingClasses.map((item) => (
                <div key={`${item.title}-${item.time}`} className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.subject} · {item.batch}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">Quick actions</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {data.quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="rounded-2xl border border-border/70 bg-background/70 p-3 text-sm font-medium text-foreground transition hover:bg-secondary"
                >
                  <span className="mr-2">{action.icon}</span>
                  {action.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">Recent activity</h3>
            <div className="mt-4 space-y-3">
              {data.recentActivity.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border/70 bg-background/70 p-3">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
