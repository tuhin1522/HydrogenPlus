import { ModulePage } from "@/app/modules/students/components/modulePage";

export default function StudentNotificationsPage() {
  return (
    <ModulePage
      title="Notifications"
      description="Review inbox updates, exam reminders, and recent alerts for your account."
      badge="Inbox"
      highlight="Unread updates"
      items={[
        "Check your latest reminders and system notifications.",
        "Follow alerts about exams, results, payments, and class updates.",
        "Stay on top of important deadlines without missing anything.",
      ]}
      metrics={[
        { label: "Unread", value: "4" },
        { label: "Today", value: "6" },
        { label: "Archive", value: "12" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Open inbox</button>}
    />
  );
}
