import { ModulePage } from "@/app/modules/students/components/modulePage";

export default function StudentProfilePage() {
  return (
    <ModulePage
      title="My Profile"
      description="Access your personal, guardian, school, batch, and branch information in one place."
      badge="Personal"
      highlight="Profile summary"
      items={[
        "View personal information, guardian details, and academic records.",
        "Update your contact details and profile photo securely.",
        "Change your password and keep account access protected.",
      ]}
      metrics={[
        { label: "Branch", value: "North Campus" },
        { label: "Batch", value: "Batch A" },
        { label: "Class", value: "Class 10" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Edit profile</button>}
    />
  );
}
