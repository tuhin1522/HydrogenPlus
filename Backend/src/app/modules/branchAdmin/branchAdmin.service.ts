import { prisma } from "@/app/lib/prisma";
import { ICreateBranchAdmin, IUpdateBranchAdmin } from "./branchAdmin.interface";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";
import AppError from "@/app/errorHelpers/appError";
import httpStatus from "http-status";

const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
};

const createBranchAdmin = async (payload: ICreateBranchAdmin) => {
  // Verify the user exists and is a teacher
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  if (user.role !== "TEACHER") {
    throw new AppError(httpStatus.BAD_REQUEST, "Only teachers can be assigned as a branch admin.");
  }

  // Check if this user already has a branch admin profile
  const isAdminExist = await prisma.branchAdminProfile.findUnique({
    where: { userId: payload.userId },
  });

  if (isAdminExist) {
    throw new AppError(httpStatus.CONFLICT, "Branch admin profile for this user already exists.");
  }

  // Check if this branch already has an admin assigned
  const isBranchTaken = await prisma.branchAdminProfile.findUnique({
    where: { branchId: payload.branchId },
  });

  if (isBranchTaken) {
    throw new AppError(httpStatus.CONFLICT, "This branch already has an admin assigned.");
  }

  const branchAdmin = await prisma.branchAdminProfile.create({
    data: payload,
  });

  // Update user role to BRANCH_ADMIN
  await prisma.user.update({
    where: { id: payload.userId },
    data: { role: "BRANCH_ADMIN" },
  });

  return branchAdmin;
};

const getAllBranchAdmins = async (query: IQueryParams) => {
  const adminQuery = new QueryBuilder(
    prisma.branchAdminProfile as any,
    query,
    {
      searchableFields: ["designation", "user.name", "user.email"],
      filterableFields: ["branchId", "userId"],
    }
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .fields()
    .dynamicInclude(
      {
        user: { select: USER_SELECT },
        branch: true,
      },
      ["user", "branch"]
    );

  return adminQuery.execute();
};

const getBranchAdminById = async (id: string) => {
  const adminQuery = new QueryBuilder(prisma.branchAdminProfile as any, {}, {})
    .where({
      OR: [{ id }, { userId: id }, { branchId: id }],
    })
    .dynamicInclude(
      {
        user: { select: USER_SELECT },
        branch: true,
      },
      ["user", "branch"]
    );

  const result = await adminQuery.execute();
  return result.data[0] || null;
};

const updateBranchAdmin = async (id: string, payload: IUpdateBranchAdmin) => {
  const branchAdmin = await prisma.branchAdminProfile.update({
    where: { id },
    data: payload,
  });
  return branchAdmin;
};

const deleteBranchAdmin = async (id: string) => {
  const branchAdmin = await prisma.branchAdminProfile.delete({
    where: { id },
  });
  return branchAdmin;
};

export const branchAdminService = {
  createBranchAdmin,
  getAllBranchAdmins,
  getBranchAdminById,
  updateBranchAdmin,
  deleteBranchAdmin,
};
