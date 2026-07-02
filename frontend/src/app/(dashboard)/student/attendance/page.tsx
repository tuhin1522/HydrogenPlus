import { ModulePage } from "@/app/modules/students/components/ModulePage";

export default function StudentAttendancePage() {
  return (
    <ModulePage
      title="Attendance"
      description="Monitor your attendance record and keep up with class participation."
      badge="Tracking"
      highlight="Attendance summary"
      items={[
        "Check your attendance percentage for the current month.",
        "Review present and absent days at a glance.",
        "Stay informed before attendance falls below the required threshold.",
      ]}
      metrics={[
        { label: "Attendance %", value: "92%" },
        { label: "Present days", value: "23" },
        { label: "Absent days", value: "2" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">View attendance report</button>}
    />
  );
}
