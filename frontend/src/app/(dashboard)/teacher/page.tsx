import { DashboardOverview } from "../../modules/teacher/components/DashboardOverview";
import { PageShell } from "../../modules/teacher/components/PageShell";

export default function TeacherDashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="A modern overview of your teaching workload, student activity, and upcoming classroom events."
      badge="Live"
      actions={
        <>
          <button className="rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground">Export report</button>
          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">New announcement</button>
        </>
      }
    >
      <DashboardOverview />
    </PageShell>
  );
}
