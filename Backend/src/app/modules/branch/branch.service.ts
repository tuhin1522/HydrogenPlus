import { prisma } from "@/app/lib/prisma";
import { ICreateBranch } from "./branch.interface";

const createBranch = async (payload: ICreateBranch) => {
    const { name, address, phone, email, status, managerName } = payload;
    await prisma.branch.create({
        data: payload
    });
}

export const branchService = {
    createBranch,
}