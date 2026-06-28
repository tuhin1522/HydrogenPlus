export interface CreateBranchAdminPayload {
  userId: string;
  branchId: string;
  joiningDate?: Date | string;
  designation?: string;
}

