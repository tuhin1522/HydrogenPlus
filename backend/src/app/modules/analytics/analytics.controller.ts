import { Request, Response } from "express";
import { analyticsService } from "./analytics.service";
import { catchAsync } from "@/app/shared/catchAsync";
import { sendResponse } from "@/app/shared/sendResponse";
import httpStatus from "http-status";

const getOverviewStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await analyticsService.getOverviewStats();
  sendResponse(res, {
    success: true,
    httpStatusCode: httpStatus.OK,
    message: "Overview statistics retrieved successfully!",
    data: stats,
  });
});

const getBranchAnalytics = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsService.getBranchAnalytics();
  sendResponse(res, {
    success: true,
    httpStatusCode: httpStatus.OK,
    message: "Branch analytics retrieved successfully!",
    data,
  });
});

const getEnrollmentTrends = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsService.getEnrollmentTrends();
  sendResponse(res, {
    success: true,
    httpStatusCode: httpStatus.OK,
    message: "Enrollment trends retrieved successfully!",
    data,
  });
});

const getSystemHealth = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsService.getSystemHealth();
  sendResponse(res, {
    success: true,
    httpStatusCode: httpStatus.OK,
    message: "System health retrieved successfully!",
    data,
  });
});

export const analyticsController = {
  getOverviewStats,
  getBranchAnalytics,
  getEnrollmentTrends,
  getSystemHealth,
};
