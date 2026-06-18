import { prisma } from "@/app/lib/prisma";
import { ICreateBranch } from "./branch.interface";

const createBranch = async (payload: ICreateBranch) => {
    const { name, address, phone, email, status, managerName } = payload;
    await prisma.branch.create({
        data: payload
    });
};

const getAllBranches = async () => {
    const branches = await prisma.branch.findMany();
    return branches;
};

const getBranchById = async (id: string) => {
    const branch = await prisma.branch.findUnique({
        where: { id }
    });
    return branch;
};

const updateBranch = async (id: string, payload: Partial<ICreateBranch>) => {
    const branch = await prisma.branch.update({
        where: { id },
        data: payload
    });
    return branch;
};

const deleteBranch = async (id: string) => {
    const branch = await prisma.branch.delete({
        where: { id }
    });
    return branch;
};

export const branchService = {
    createBranch,
    getAllBranches,
    getBranchById,
    updateBranch,
    deleteBranch
}