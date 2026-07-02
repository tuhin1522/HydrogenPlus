import { PageShell } from "../../../modules/teacher/components/PageShell";
import { EmptyState } from "../../../modules/teacher/components/EmptyState";

const courses = [
  { title: "Physics Crash Course", status: "Published", batch: "Batch A", price: "$49" },
  { title: "Math Problem Solving", status: "Draft", batch: "Batch C", price: "$39" },
];

export default function TeacherCoursesPage() {
  return (
    <PageShell
      title="Courses"
      description="Create, manage, publish, and archive your teaching courses with a clear workflow."
      badge="Content"
      actions={<button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create course</button>}
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {courses.map((course) => (
          <div key={course.title} className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{course.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Assigned batch: {course.batch}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{course.status}</span>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
              <span>Price: {course.price}</span>
              <div className="flex gap-2">
                <button className="rounded-lg border border-border/70 px-3 py-1.5 font-medium text-foreground">Edit</button>
                <button className="rounded-lg border border-border/70 px-3 py-1.5 font-medium text-foreground">Publish</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
