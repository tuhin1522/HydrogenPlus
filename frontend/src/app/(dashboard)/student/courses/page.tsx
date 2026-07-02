import { ModulePage } from "@/app/modules/students/components/modulePage";

export default function StudentCoursesPage() {
  return (
    <ModulePage
      title="My Courses"
      description="Browse every enrolled course, track progress, and continue from where you left off."
      badge="Learning"
      highlight="Course library"
      items={[
        "See all enrolled courses with progress, teacher names, and lesson counts.",
        "Search and filter your courses by subject or status.",
        "Jump back into any course from the dashboard or lesson cards.",
      ]}
      metrics={[
        { label: "Active courses", value: "4" },
        { label: "Completed lessons", value: "124" },
        { label: "Average progress", value: "76%" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Filter courses</button>}
    />
  );
}
