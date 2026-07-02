import { PageShell } from "../../../modules/teacher/components/PageShell";

const lessons = [
  { title: "Chapter 1 Overview", type: "Video", duration: "12 min", visibility: "Published", order: 1 },
  { title: "Formula Notes", type: "PDF", duration: "4 min", visibility: "Draft", order: 2 },
  { title: "Practice Images", type: "Images", duration: "2 min", visibility: "Published", order: 3 },
];

export default function TeacherCourseContentPage() {
  return (
    <PageShell
      title="Course Content"
      description="Upload lesson resources, manage visibility, and reorder content for your courses."
      badge="Resources"
      actions={<button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Upload content</button>}
    >
      <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Lesson library</h2>
            <p className="text-sm text-muted-foreground">Drag and drop lesson ordering is available in the full experience.</p>
          </div>
          <button className="rounded-xl border border-border/70 px-3 py-2 text-sm font-medium text-foreground">Arrange</button>
        </div>
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <div key={lesson.title} className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-foreground">{lesson.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{lesson.type} · {lesson.duration}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">Order {lesson.order}</span>
                <span className="rounded-full border border-border/70 px-2.5 py-1 text-xs font-semibold text-muted-foreground">{lesson.visibility}</span>
                <button className="rounded-lg border border-border/70 px-3 py-1.5 text-sm font-medium text-foreground">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
