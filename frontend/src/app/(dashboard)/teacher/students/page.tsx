import { PageShell } from "../../../modules/teacher/components/PageShell";

const students = [
  { name: "Rafiq Rahman", studentId: "ST-1021", classLevel: "Class 10", batch: "Batch A", phone: "+8801712345678", guardian: "Abdul Rahman", attendance: "93%", averageMarks: "88%", status: "Excellent" },
  { name: "Nadia Islam", studentId: "ST-1022", classLevel: "Class 10", batch: "Batch B", phone: "+8801812345678", guardian: "Shamim Islam", attendance: "87%", averageMarks: "81%", status: "On Track" },
  { name: "Farhan Kabir", studentId: "ST-1023", classLevel: "Class 9", batch: "Batch C", phone: "+8801912345678", guardian: "Kabir Hossain", attendance: "79%", averageMarks: "74%", status: "Needs Attention" },
];

export default function TeacherStudentsPage() {
  return (
    <PageShell
      title="Students"
      description="Monitor student progress, attendance, and performance across your assigned batches."
      badge="Assigned"
      actions={<button className="rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground">Export</button>}
    >
      <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Student roster</h2>
            <p className="text-sm text-muted-foreground">Only students from your assigned batches are visible here.</p>
          </div>
          <div className="flex gap-2">
            <input className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm sm:w-56" placeholder="Search students" />
            <button className="rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground">Filter</button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-border/70">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-muted/60 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Student ID</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Guardian</th>
                <th className="px-4 py-3 font-medium">Attendance</th>
                <th className="px-4 py-3 font-medium">Marks</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {students.map((student) => (
                <tr key={student.studentId} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{student.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.studentId}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.classLevel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.batch}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.guardian}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.attendance}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.averageMarks}</td>
                  <td className="px-4 py-3 text-muted-foreground">{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
