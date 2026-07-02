import { PageShell } from "../../../modules/teacher/components/pageShell";

const routine = [
  { day: "Monday", session: "09:00 - 10:30", batch: "Batch A", subject: "Physics" },
  { day: "Tuesday", session: "11:00 - 12:30", batch: "Batch C", subject: "Mathematics" },
  { day: "Wednesday", session: "14:00 - 15:30", batch: "Batch B", subject: "Chemistry" },
];

export default function TeacherRoutinePage() {
  return (
    <PageShell
      title="Routine"
      description="Review your weekly routine, today’s classes, and upcoming sessions at a glance."
      badge="Schedule"
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Today’s classes</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
              <p className="font-medium text-foreground">Physics Lab</p>
              <p className="mt-1 text-sm text-muted-foreground">09:00 · Batch A</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
              <p className="font-medium text-foreground">Mathematics Review</p>
              <p className="mt-1 text-sm text-muted-foreground">11:30 · Batch C</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Weekly table view</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border/70">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/60 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Day</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Batch</th>
                  <th className="px-4 py-3">Subject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {routine.map((entry) => (
                  <tr key={entry.day}>
                    <td className="px-4 py-3 font-medium text-foreground">{entry.day}</td>
                    <td className="px-4 py-3 text-muted-foreground">{entry.session}</td>
                    <td className="px-4 py-3 text-muted-foreground">{entry.batch}</td>
                    <td className="px-4 py-3 text-muted-foreground">{entry.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
