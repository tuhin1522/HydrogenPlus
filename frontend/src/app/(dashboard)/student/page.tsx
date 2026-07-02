import { DashboardOverview } from "@/app/modules/student/components/sections/dashboard-overview";
import { PageShell } from "@/app/modules/student/components/shared/page-shell";

export default function StudentDashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="A modern view of your classes, progress, upcoming exams, and study priorities."
      badge="Live"
      actions={
        <>
          <button className="rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground">Export report</button>
          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Continue learning</button>
        </>
      }
    >
      <DashboardOverview />
    </PageShell>
  );
}
