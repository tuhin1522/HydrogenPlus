import { PageShell } from "../../../modules/teacher/components/pageShell";

export default function TeacherAnnouncementsPage() {
  return (
    <PageShell
      title="Announcements"
      description="Send important updates to specific batches, subjects, or all assigned students."
      badge="Communication"
      actions={<button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">New announcement</button>}
    >
      <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="space-y-3">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">Physics exam reminder · Batch A · Today</div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">Class schedule update · All assigned students · Tomorrow</div>
        </div>
      </div>
    </PageShell>
  );
}
