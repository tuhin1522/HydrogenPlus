import { PageShell } from "@/app/modules/teacher/components/shared/page-shell";

export default function TeacherSettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Tune your workspace experience, notification preferences, and appearance."
      badge="Preferences"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Theme</h2>
          <p className="mt-1 text-sm text-muted-foreground">Switch between light and dark modes for comfortable teaching sessions.</p>
          <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-4">Theme switcher is available in the header and sidebar.</div>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose which classroom alerts you want to receive.</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">Exam alerts</div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">Assignment updates</div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">Announcements</div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
