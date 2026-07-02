import { PageShell } from "../../../modules/teacher/components/PageShell";

export default function TeacherExamsPage() {
  return (
    <PageShell
      title="Exams"
      description="Create question banks, schedule exams, publish results, and monitor leaderboard performance."
      badge="Assessments"
      actions={<button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create exam</button>}
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Question bank</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create multiple-choice, true/false, and short questions for your upcoming assessments.</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">MCQ questions: 42</div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">True/False questions: 18</div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">Short questions: 24</div>
          </div>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Scheduled exams</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">Mid-term Physics · 14 July · Batch A</div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">Weekly Mock Math · 17 July · Batch C</div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
