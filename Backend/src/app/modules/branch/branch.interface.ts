import { BranchStatus } from "@/generated/prisma";


export interface ICreateBranch {
    name: string;
    managerName: string;
    address: string;
    phone: string;
    email?: string;
    status?: BranchStatus;
}