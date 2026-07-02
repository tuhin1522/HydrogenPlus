import { PageShell } from "@/app/modules/teacher/components/shared/page-shell";

const notifications = [
  { title: "Exam alert", description: "Mid-term Physics exam is scheduled for next week.", time: "5m ago" },
  { title: "Assignment reminder", description: "Batch C submitted their worksheets yesterday.", time: "45m ago" },
  { title: "Course update", description: "New course content was published for Physics.", time: "1h ago" },
];

export default function TeacherNotificationsPage() {
  return (
    <PageShell
      title="Notifications"
      description="Stay on top of alerts, updates, and important classroom reminders."
      badge="Alerts"
    >
      <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
        <div className="space-y-3">
          {notifications.map((item) => (
            <div key={item.title} className="flex items-start justify-between rounded-2xl border border-border/60 bg-background/70 p-4">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
