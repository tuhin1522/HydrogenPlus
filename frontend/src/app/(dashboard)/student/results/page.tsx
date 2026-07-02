import { ModulePage } from "@/app/modules/students/components/ModulePage";

export default function StudentResultsPage() {
  return (
    <ModulePage
      title="Results"
      description="Review your academic performance, marks, and result trends over time."
      badge="Performance"
      highlight="Result overview"
      items={[
        "Open recent test and exam results instantly.",
        "Compare marks across subjects to see where you are improving.",
        "Use result insights to guide your next revision plan.",
      ]}
      metrics={[
        { label: "Average score", value: "84%" },
        { label: "Highest mark", value: "95%" },
        { label: "Improvement", value: "+6%" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">View detailed results</button>}
    />
  );
}
