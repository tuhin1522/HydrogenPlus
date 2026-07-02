import { ModulePage } from "@/app/modules/students/components/modulePage";

export default function StudentCourseContentPage() {
  return (
    <ModulePage
      title="Course Contents"
      description="Access lessons, videos, PDF notes, downloads, and learning resources from your enrolled courses."
      badge="Resources"
      highlight="Study materials"
      items={[
        "Open recorded lessons and watch new course videos.",
        "Download PDF notes and study materials for offline revision.",
        "Track completed lessons and continue with the next topic.",
      ]}
      metrics={[
        { label: "Videos ready", value: "18" },
        { label: "PDF notes", value: "12" },
        { label: "Next lesson", value: "Chapter 8" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Continue learning</button>}
    />
  );
}
