import { PageShell } from "@/app/components/teacher/shared/page-shell";

export default function TeacherAssignmentsPage() {
  return (
    <PageShell
      title="Assignments"
      description="Create assignments, track submissions, and share graded feedback with your students."
      badge="Review"
      actions={<button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create assignment</button>}
    >
      <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Active assignments</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">5</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Pending evaluation</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">18</p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">Physics worksheet · Due 10 July · Batch A</div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">Math challenge · Due 12 July · Batch C</div>
        </div>
      </div>
    </PageShell>
  );
}
