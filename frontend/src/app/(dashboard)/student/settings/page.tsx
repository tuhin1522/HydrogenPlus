import { ModulePage } from "@/app/modules/students/components/ModulePage";

export default function StudentSettingsPage() {
  return (
    <ModulePage
      title="Settings"
      description="Manage account preferences, privacy, and communication preferences."
      badge="Preferences"
      highlight="Account controls"
      items={[
        "Update your display preferences and theme settings.",
        "Manage notification preferences for classes and announcements.",
        "Keep your account and security preferences up to date.",
      ]}
      metrics={[
        { label: "Theme", value: "System" },
        { label: "Language", value: "English" },
        { label: "Security", value: "Protected" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Open settings</button>}
    />
  );
}
