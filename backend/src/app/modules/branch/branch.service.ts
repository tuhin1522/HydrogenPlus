import { prisma } from "@/app/lib/prisma";
import { ICreateBranch } from "./branch.interface";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";

import AppError from "@/app/errorHelpers/appError";
import httpStatus from "http-status";

const createBranch = async (payload: ICreateBranch) => {
    const { name, address, phone, email, status, managerName } = payload;
    
    const isBranchExist = await prisma.branch.findFirst({
        where: { 
            name,
            address
        }
    });

    if (isBranchExist) {
        throw new AppError(httpStatus.CONFLICT, `A branch with the name '${name}' at address '${address}' already exists.`);
    }

    await prisma.branch.create({
        data: payload
    });
};

const getAllBranches = async (query: IQueryParams) => {
    const branchQuery = new QueryBuilder(
        prisma.branch as any,
        query,
        {
            searchableFields: ['name', 'address', 'managerName'],
            filterableFields: ['status']
        }
    ).search().filter().sort().paginate().fields();
    
    const result = await branchQuery.execute();
    return result;
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