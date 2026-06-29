export interface CreateBranchAdminPayload {
  userId: string;
  branchId: string;
  joiningDate?: Date | string;
  designation?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "BRANCH_ADMIN" | "TEACHER" | "STUDENT";
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
