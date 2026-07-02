import type { StudentDashboardOverview } from "@/app/modules/students/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeStudentDashboardOverview(value: unknown): StudentDashboardOverview | null {
  if (!isRecord(value)) return null;

  const stats = value.stats;
  const performance = value.performance;
  const upcomingClasses = value.upcomingClasses;
  const quickActions = value.quickActions;
  const recentActivity = value.recentActivity;

  if (!isRecord(stats) || !Array.isArray(performance) || !Array.isArray(upcomingClasses) || !Array.isArray(quickActions) || !Array.isArray(recentActivity)) {
    return null;
  }

  return {
    stats: {
      currentClass: typeof stats.currentClass === "string" ? stats.currentClass : "",
      currentBatch: typeof stats.currentBatch === "string" ? stats.currentBatch : "",
      enrolledCourses: typeof stats.enrolledCourses === "number" ? stats.enrolledCourses : 0,
      upcomingExams: typeof stats.upcomingExams === "number" ? stats.upcomingExams : 0,
      completedExams: typeof stats.completedExams === "number" ? stats.completedExams : 0,
      attendancePercentage: typeof stats.attendancePercentage === "number" ? stats.attendancePercentage : 0,
    },
    performance: performance.filter((item): item is { label: string; value: number } => isRecord(item) && typeof item.label === "string" && typeof item.value === "number"),
    upcomingClasses: upcomingClasses.filter((item): item is { title: string; time: string; batch: string; subject: string } => isRecord(item) && typeof item.title === "string" && typeof item.time === "string" && typeof item.batch === "string" && typeof item.subject === "string"),
    quickActions: quickActions.filter((item): item is { title: string; href: string; icon: string } => isRecord(item) && typeof item.title === "string" && typeof item.href === "string" && typeof item.icon === "string"),
    recentActivity: recentActivity.filter((item): item is { title: string; description: string; time: string } => isRecord(item) && typeof item.title === "string" && typeof item.description === "string" && typeof item.time === "string"),
  };
}
