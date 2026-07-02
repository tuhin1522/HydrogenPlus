import { StudentShell } from "@/app/modules/students/components/studentShell";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}
