export interface CreateBranchAdminPayload {
  userId: string;
  branchId: string;
  joiningDate?: Date | string;
  designation?: string;
}

export type UserRole =
  | "SUPER_ADMIN"
  | "BRANCH_ADMIN"
  | "TEACHER"
  | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserForm {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: Exclude<UserRole, "SUPER_ADMIN">;
  isActive?: boolean;
}

export interface TeacherUser {
  name?: string;
  email?: string;
  role?: string;
};

export interface SuperAdminUser {
  name?: string;
  email?: string;
  role?: string;
}