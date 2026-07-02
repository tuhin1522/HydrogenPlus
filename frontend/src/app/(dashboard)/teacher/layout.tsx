import { TeacherShell } from "../../modules/teacher/components/TeacherShell";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherShell>{children}</TeacherShell>;
}
