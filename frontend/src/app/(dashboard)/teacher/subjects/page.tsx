import { PageShell } from "../../../modules/teacher/components/PageShell";

const subjects = [
  { name: "Physics", classLevel: "Class 10", batch: "Batch A", students: 34 },
  { name: "Chemistry", classLevel: "Class 10", batch: "Batch B", students: 28 },
  { name: "Mathematics", classLevel: "Class 9", batch: "Batch C", students: 31 },
];

export default function TeacherSubjectsPage() {
  return (
    <PageShell
      title="My Subjects"
      description="View the subjects assigned to you and their learner counts."
      badge="Assigned"
      actions={<button className="rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground">Filter</button>}
    >
      <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Assigned subjects</h2>
            <p className="text-sm text-muted-foreground">Search, filter, and keep track of your teaching load.</p>
          </div>
          <input className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm sm:w-64" placeholder="Search subjects" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border/70">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {subjects.map((subject) => (
                <tr key={subject.name} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{subject.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{subject.classLevel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{subject.batch}</td>
                  <td className="px-4 py-3 text-muted-foreground">{subject.students}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
