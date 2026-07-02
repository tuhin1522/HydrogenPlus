import { PageShell } from "../../../modules/teacher/components/pageShell";

export default function TeacherAttendancePage() {
  return (
    <PageShell
      title="Attendance"
      description="Mark present, absent, or late and generate class attendance reports in moments."
      badge="Tracking"
      actions={<button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Generate report</button>}
    >
      <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Present</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">28</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Absent</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">3</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <p className="text-sm text-muted-foreground">Late</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">2</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-border/60 bg-background/70 p-4">
          <p className="text-sm font-medium text-foreground">Today’s attendance checklist</p>
          <p className="mt-2 text-sm text-muted-foreground">Use the streamlined attendance panel to mark each student quickly during class.</p>
        </div>
      </div>
    </PageShell>
  );
}
