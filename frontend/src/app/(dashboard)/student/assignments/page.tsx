import { ModulePage } from "@/app/modules/students/components/ModulePage";

export default function StudentAssignmentsPage() {
  return (
    <ModulePage
      title="Assignments"
      description="Track assigned work, submission deadlines, teacher feedback, and marks in one place."
      badge="Submission"
      highlight="Assignment status"
      items={[
        "Review active and completed assignments with deadlines.",
        "Upload your work and monitor submission status.",
        "Track teacher feedback and marks once evaluation is complete.",
      ]}
      metrics={[
        { label: "Pending", value: "2" },
        { label: "Submitted", value: "5" },
        { label: "Feedback", value: "1 new" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Upload assignment</button>}
    />
  );
}
