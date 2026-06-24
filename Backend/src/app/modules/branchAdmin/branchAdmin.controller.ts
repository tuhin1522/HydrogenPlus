import { Request, Response } from "express";
import { catchAsync } from "@/app/shared/catchAsync";
import { branchAdminService } from "./branchAdmin.service";
import { sendResponse } from "@/app/shared/sendResponse";
import { status } from "http-status";

const createBranchAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const branchAdmin = await branchAdminService.createBranchAdmin(payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.CREATED,
    message: "Branch Admin Created Successfully!",
    data: branchAdmin,
  });
});

const getAllBranchAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await branchAdminService.getAllBranchAdmins(req.query);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Branch Admins Retrieved Successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getBranchAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const branchAdmin = await branchAdminService.getBranchAdminById(id as string);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Branch Admin Retrieved Successfully!",
    data: branchAdmin,
  });
});

const updateBranchAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const branchAdmin = await branchAdminService.updateBranchAdmin(id as string, payload);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Branch Admin Updated Successfully!",
    data: branchAdmin,
  });
});

const deleteBranchAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const branchAdmin = await branchAdminService.deleteBranchAdmin(id as string);

  sendResponse(res, {
    success: true,
    httpStatusCode: status.OK,
    message: "Branch Admin Deleted Successfully!",
    data: branchAdmin,
  });
});

export const branchAdminController = {
  createBranchAdmin,
  getAllBranchAdmins,
  getBranchAdminById,
  updateBranchAdmin,
  deleteBranchAdmin,
};
