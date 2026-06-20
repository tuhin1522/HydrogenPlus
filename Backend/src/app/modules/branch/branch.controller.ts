import { Request, Response } from "express";
import { branchService } from "./branch.service";
import { catchAsync } from "@/app/shared/catchAsync";
import { sendResponse } from "@/app/shared/sendResponse";
import status from "http-status";

const createBranch = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const branch = await branchService.createBranch(payload);

    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Branch Created Successfully!',
        data: branch,
    })
});

const getAllBranches = catchAsync(async (req: Request, res: Response) => {
    const branches = await branchService.getAllBranches(req.query);

    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Branches Retrieved Successfully!',
        data: branches.data,
        meta: branches.meta,
    })
});

const getBranchById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const branch = await branchService.getBranchById(id as string);

    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Branch Retrieved Successfully!',
        data: branch,
    })
});

const updateBranch = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const branch = await branchService.updateBranch(id as string, payload);

    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Branch Updated Successfully!',
        data: branch,
    })
});

const deleteBranch = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const branch = await branchService.deleteBranch(id as string);

    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Branch Deleted Successfully!',
        data: branch,
    })
});

export const branchController = {
    createBranch,
    getAllBranches,
    getBranchById,
    updateBranch,
    deleteBranch
}