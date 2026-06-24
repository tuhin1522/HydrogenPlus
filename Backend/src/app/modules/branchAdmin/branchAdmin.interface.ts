export interface ICreateBranchAdmin {
  userId: string;
  branchId: string;
  joiningDate?: Date | string;
  designation?: string;
}

export interface IUpdateBranchAdmin {
  branchId?: string;
  joiningDate?: Date | string;
  designation?: string;
}
