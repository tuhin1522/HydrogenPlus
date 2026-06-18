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

export const branchController = {
    createBranch
}