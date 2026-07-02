import { TeacherShell } from "@/app/modules/teacher/components/teacher-shell";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherShell>{children}</TeacherShell>;
}
