import { Request, Response } from "express";
import { systemService } from "./system.service";
import { catchAsync } from "@/app/shared/catchAsync";
import { sendResponse } from "@/app/shared/sendResponse";
import httpStatus from "http-status";

// ====== USER MANAGEMENT ======
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await systemService.getAllUsers(req.query);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "Users retrieved!", data: result.data, meta: result.meta });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await systemService.getUserById(req.params.id as string);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "User retrieved!", data: user });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await systemService.createUser(req.body, req.user?.userId);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.CREATED, message: "User created!", data: user });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await systemService.updateUser(req.params.id as string, req.body, req.user?.userId);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "User updated!", data: user });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { isActive } = req.body;
  const user = await systemService.updateUserStatus(req.params.id as string, isActive, req.user?.userId);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "User status updated!", data: user });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await systemService.deleteUser(req.params.id as string, req.user?.userId);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "User deleted!", data: null });
});

// ====== NOTIFICATIONS ======
const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await systemService.getAllNotifications(req.query);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "Notifications retrieved!", data: result.data, meta: result.meta });
});

const createNotification = catchAsync(async (req: Request, res: Response) => {
  const notification = await systemService.createNotification(req.body, req.user?.userId);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.CREATED, message: "Notification created!", data: notification });
});

const markNotificationRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await systemService.markNotificationRead(req.params.id as string);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "Notification marked as read!", data: notification });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  await systemService.deleteNotification(req.params.id as string);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "Notification deleted!", data: null });
});

// ====== SETTINGS ======
const getAllSettings = catchAsync(async (req: Request, res: Response) => {
  const settings = await systemService.getAllSettings();
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "Settings retrieved!", data: settings });
});

const upsertSetting = catchAsync(async (req: Request, res: Response) => {
  const { key, value, description } = req.body;
  const setting = await systemService.upsertSetting(key, value, description, req.user?.userId);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "Setting saved!", data: setting });
});

const deleteSetting = catchAsync(async (req: Request, res: Response) => {
  await systemService.deleteSetting(req.params.key as string, req.user?.userId);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "Setting deleted!", data: null });
});

// ====== AUDIT LOGS ======
const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await systemService.getAuditLogs(req.query);
  sendResponse(res, { success: true, httpStatusCode: httpStatus.OK, message: "Audit logs retrieved!", data: result.data, meta: result.meta });
});

export const systemController = {
  getAllUsers, getUserById, createUser, updateUser, updateUserStatus, deleteUser,
  getAllNotifications, createNotification, markNotificationRead, deleteNotification,
  getAllSettings, upsertSetting, deleteSetting,
  getAuditLogs,
};
