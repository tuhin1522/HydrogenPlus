import { PageShell } from "@/app/modules/teacher/components/shared/page-shell";

const batches = [
  { name: "Batch A", classLevel: "Class 10", students: 34, subjects: ["Physics", "Chemistry"] },
  { name: "Batch B", classLevel: "Class 10", students: 28, subjects: ["Mathematics", "Biology"] },
  { name: "Batch C", classLevel: "Class 9", students: 31, subjects: ["Math", "English"] },
];

export default function TeacherBatchesPage() {
  return (
    <PageShell
      title="My Batches"
      description="Keep an eye on your assigned batches, student counts, and teaching load."
      badge="Groups"
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {batches.map((batch) => (
          <div key={batch.name} className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{batch.name}</h2>
                <p className="text-sm text-muted-foreground">{batch.classLevel}</p>
              </div>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {batch.students} learners
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Assigned subjects</p>
              <div className="flex flex-wrap gap-2">
                {batch.subjects.map((subject) => (
                  <span key={subject} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            <button className="mt-5 w-full rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
              Open batch details
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
