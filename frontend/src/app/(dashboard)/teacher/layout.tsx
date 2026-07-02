import { TeacherShell } from "@/app/modules/teacher/components/shared/teacher-shell";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherShell>{children}</TeacherShell>;
}
