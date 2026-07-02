import { TeacherShell } from "@/app/components/teacher/shared/teacher-shell";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherShell>{children}</TeacherShell>;
}
