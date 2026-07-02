import { TeacherShell } from "../../modules/teacher/components/teacherShell";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherShell>{children}</TeacherShell>;
}
