import { ModulePage } from "@/app/modules/student/components/shared/module-page";

export default function StudentRoutinePage() {
  return (
    <ModulePage
      title="Routine"
      description="Review your weekly schedule, today’s classes, and upcoming live sessions."
      badge="Schedule"
      highlight="Weekly planner"
      items={[
        "View your weekly ongoing timetable in a clean table format.",
        "See today’s and upcoming classes at a glance.",
        "Download the routine as a PDF for quick reference.",
      ]}
      metrics={[
        { label: "Today’s classes", value: "3" },
        { label: "Upcoming", value: "2" },
        { label: "Downloaded", value: "Yes" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Download routine PDF</button>}
    />
  );
}
