import { ModulePage } from "@/app/modules/students/components/ModulePage";

export default function StudentExamsPage() {
  return (
    <ModulePage
      title="Exams"
      description="View upcoming exams, mock tests, and your preparation checklist in one place."
      badge="Assessment"
      highlight="Exam readiness"
      items={[
        "See the full exam calendar with dates, subjects, and timings.",
        "Open mock tests and practice papers for revision.",
        "Track your preparation progress and focus areas before each exam.",
      ]}
      metrics={[
        { label: "Upcoming tests", value: "3" },
        { label: "Attempted", value: "5" },
        { label: "Best score", value: "91%" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Start practice exam</button>}
    />
  );
}
