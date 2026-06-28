import { Request, Response } from "express";
import { batchSubjectService } from "./batchSubject.service";
import { catchAsync } from "@/app/shared/catchAsync";
import { ICreateBatchSubject } from "./batchSubject.interface";
import { IQueryParams } from "@/app/interface/query.interface";
import { sendResponse } from "@/app/shared/sendResponse";

const createBatchSubject = catchAsync(async (req: Request, res: Response) => {
    const payload: ICreateBatchSubject = req.body;
    const batchSubject = await batchSubjectService.createBatchSubject(payload);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "Batch subject created successfully",
        data: batchSubject,
    });
});

const getAllBatchSubjects = catchAsync(async (req: Request, res: Response) => {
    const query: IQueryParams = req.query;
    const result = await batchSubjectService.getAllBatchSubjects(query);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Batch subjects fetched successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getBatchSubjectById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const batchSubject = await batchSubjectService.getBatchSubjectById(id as string);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Batch subject fetched successfully",
        data: batchSubject,
    });
});

const updateBatchSubject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedBatchSubject = await batchSubjectService.updateBatchSubject(id as string, payload);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Batch subject updated successfully",
        data: updatedBatchSubject,
    });
});

const deleteBatchSubject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await batchSubjectService.deleteBatchSubject(id as string);
    sendResponse(res, {
        httpStatusCode: 200,
        success: true,
        message: "Batch subject deleted successfully",
    });
});

export const batchSubjectController = {
    createBatchSubject,
    getAllBatchSubjects,
    getBatchSubjectById,
    updateBatchSubject,
    deleteBatchSubject,
};