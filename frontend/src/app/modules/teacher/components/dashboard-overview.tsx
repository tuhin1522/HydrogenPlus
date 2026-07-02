"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { teacherService, type TeacherDashboardOverview } from "@/app/modules/teacher/services/teacher.service";
import { ContentSkeleton } from "@/app/modules/teacher/components/content-skeleton";

export function DashboardOverview() {
  const [overview, setOverview] = useState<TeacherDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const data = await teacherService.getDashboardOverview();
      if (mounted) {
        setOverview(data);
        setLoading(false);
        toast.success("Dashboard refreshed");
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Assigned Batches",
        value: overview?.stats.assignedBatches ?? "—",
        hint: "Active learning groups",
      },
      {
        label: "Total Subjects",
        value: overview?.stats.totalSubjects ?? "—",
        hint: "Across your branches",
      },
      {
        label: "Total Students",
        value: overview?.stats.totalStudents ?? "—",
        hint: "Across all assigned batches",
      },
      {
        label: "Today’s Classes",
        value: overview?.stats.todaysClasses ?? "—",
        hint: "Live sessions today",
      },
      {
        label: "Upcoming Exams",
        value: overview?.stats.upcomingExams ?? "—",
        hint: "Scheduled in the next 7 days",
      },
      {
        label: "Published Courses",
        value: overview?.stats.publishedCourses ?? "—",
        hint: "Ready for learners",
      },
    ],
    [overview],
  );

  if (loading) {
    return <ContentSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Student performance overview</h2>
              <p className="mt-1 text-sm text-muted-foreground">Weekly performance trends across assigned batches.</p>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Updated 2h ago
            </span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3">
            {overview?.charts.performance.map((value, index) => (
              <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-36 w-full items-end rounded-2xl bg-muted/60 p-1">
                  <div className="w-full rounded-xl bg-gradient-to-t from-primary to-emerald-400" style={{ height: `${value}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Upcoming classes</h2>
            <p className="mt-1 text-sm text-muted-foreground">A quick look at what is on your schedule today.</p>
          </div>
          <div className="space-y-3">
            {overview?.upcomingClasses.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/60 bg-background/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <span className="text-xs font-semibold text-primary">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.batch} · {item.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent activity</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest uploads, questions, and updates from your classes.</p>
            </div>
            <Link href="/teacher/course-content" className="text-sm font-medium text-primary transition hover:opacity-80">
              Open course content
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {overview?.activity.map((item) => (
              <div key={item.title} className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 p-3">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-muted-foreground">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Weekly teaching schedule</h2>
              <p className="mt-1 text-sm text-muted-foreground">Your teaching cadence for the current week.</p>
            </div>
            <Link href="/teacher/routine" className="text-sm font-medium text-primary transition hover:opacity-80">
              Manage routine
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {overview?.schedule.map((entry) => (
              <div key={entry.day} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 p-3">
                <div>
                  <p className="font-medium text-foreground">{entry.day}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{entry.session}</p>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                  {entry.batch}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
