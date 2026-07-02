import { BranchAdminShell } from "../../modules/branch-admin/components/BranchAdminShell";

export default function BranchAdminLayout({ children }: { children: React.ReactNode }) {
  return <BranchAdminShell>{children}</BranchAdminShell>;
}
