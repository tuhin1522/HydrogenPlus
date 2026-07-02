import { ModulePage } from "@/app/modules/students/components/ModulePage";

export default function StudentAnnouncementsPage() {
  return (
    <ModulePage
      title="Announcements"
      description="Stay updated with institute notices, batch reminders, and important updates."
      badge="Updates"
      highlight="Recent announcements"
      items={[
        "Read important notices from your branch or institute.",
        "See batch-specific reminders and schedule adjustments.",
        "Stay informed about deadlines, events, and policy changes.",
      ]}
      metrics={[
        { label: "New updates", value: "3" },
        { label: "This week", value: "7" },
        { label: "Pinned", value: "2" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">View all announcements</button>}
    />
  );
}
