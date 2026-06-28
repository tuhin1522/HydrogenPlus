import { prisma } from "@/app/lib/prisma";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";
import AppError from "@/app/errorHelpers/appError";
import httpStatus from "http-status";
import bcryptjs from "bcryptjs";
import { UserRole } from "@/generated/prisma";
import { createAuditLog } from "@/app/utils/auditLog";

const ADMIN_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  emailVerified: true,
  lastLogin: true,
  createdAt: true,
} as const;

const assertNotSuperAdmin = (user: { role: UserRole }, action: string) => {
  if (user.role === UserRole.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, `Cannot ${action} a super admin account.`);
  }
};

// ============ USER MANAGEMENT ============
const getAllUsers = async (query: IQueryParams) => {
  const userQuery = new QueryBuilder(
    prisma.user as any,
    query,
    {
      searchableFields: ["name", "email", "phone"],
      filterableFields: ["role", "isActive", "emailVerified"],
    }
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .fields();

  return userQuery.execute();
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...ADMIN_SELECT,
      studentProfile: true,
      teacherProfile: true,
      branchAdminProfile: true,
    },
  });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  return user;
};

const createUser = async (
  payload: { name: string; email: string; phone: string; password: string; role: UserRole },
  actorId?: string
) => {
  if (payload.role === UserRole.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "SUPER_ADMIN accounts cannot be created via API.");
  }

  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) throw new AppError(httpStatus.CONFLICT, "Email already registered.");

  const hashedPassword = await bcryptjs.hash(payload.password, 10);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: hashedPassword,
      role: payload.role,
      emailVerified: true,
    },
    select: ADMIN_SELECT,
  });

  await createAuditLog({
    action: "CREATE",
    entityType: "User",
    entityId: user.id,
    details: `Created user ${user.email} with role ${user.role}`,
    userId: actorId,
  });

  return user;
};

const updateUser = async (
  id: string,
  payload: Partial<{ name: string; email: string; phone: string; role: UserRole; isActive: boolean }>,
  actorId?: string
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  assertNotSuperAdmin(user, "modify");

  if (payload.role === UserRole.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Cannot assign SUPER_ADMIN role via API.");
  }

  if (payload.email && payload.email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) throw new AppError(httpStatus.CONFLICT, "Email already in use.");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: payload,
    select: ADMIN_SELECT,
  });

  await createAuditLog({
    action: "UPDATE",
    entityType: "User",
    entityId: id,
    details: `Updated user ${updated.email}`,
    userId: actorId,
  });

  return updated;
};

const updateUserStatus = async (id: string, isActive: boolean, actorId?: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  assertNotSuperAdmin(user, "deactivate");

  const updated = await prisma.user.update({ where: { id }, data: { isActive }, select: ADMIN_SELECT });

  await createAuditLog({
    action: isActive ? "ACTIVATE" : "DEACTIVATE",
    entityType: "User",
    entityId: id,
    details: `${isActive ? "Activated" : "Deactivated"} user ${updated.email}`,
    userId: actorId,
  });

  return updated;
};

const deleteUser = async (id: string, actorId?: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  assertNotSuperAdmin(user, "delete");

  await prisma.user.delete({ where: { id } });

  await createAuditLog({
    action: "DELETE",
    entityType: "User",
    entityId: id,
    details: `Deleted user ${user.email}`,
    userId: actorId,
  });
};

// ============ NOTIFICATIONS ============
const getAllNotifications = async (query: IQueryParams) => {
  const nQuery = new QueryBuilder(
    prisma.notification as any,
    query,
    {
      searchableFields: ["title", "message"],
      filterableFields: ["type", "isRead", "userId"],
    }
  )
    .search()
    .filter()
    .sort()
    .paginate();
  return nQuery.execute();
};

const createNotification = async (payload: { title: string; message: string; type?: string; userId?: string }, actorId?: string) => {
  const notification = await prisma.notification.create({ data: payload });

  await createAuditLog({
    action: "CREATE",
    entityType: "Notification",
    entityId: notification.id,
    details: `Created notification: ${payload.title}`,
    userId: actorId,
  });

  return notification;
};

const markNotificationRead = async (id: string) => {
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
};

const deleteNotification = async (id: string) => {
  return prisma.notification.delete({ where: { id } });
};

// ============ SYSTEM SETTINGS ============
const getAllSettings = async () => {
  return prisma.systemSetting.findMany({ orderBy: { key: "asc" } });
};

const upsertSetting = async (key: string, value: string, description?: string, actorId?: string) => {
  const setting = await prisma.systemSetting.upsert({
    where: { key },
    update: { value, description },
    create: { key, value, description },
  });

  await createAuditLog({
    action: "UPSERT",
    entityType: "SystemSetting",
    entityId: setting.id,
    details: `Updated setting ${key}`,
    userId: actorId,
  });

  return setting;
};

const deleteSetting = async (key: string, actorId?: string) => {
  const setting = await prisma.systemSetting.delete({ where: { key } });

  await createAuditLog({
    action: "DELETE",
    entityType: "SystemSetting",
    entityId: setting.id,
    details: `Deleted setting ${key}`,
    userId: actorId,
  });

  return setting;
};

// ============ AUDIT LOGS ============
const getAuditLogs = async (query: IQueryParams) => {
  const logQuery = new QueryBuilder(
    prisma.auditLog as any,
    query,
    {
      searchableFields: ["action", "entityType", "details"],
      filterableFields: ["userId", "entityType"],
    }
  )
    .search()
    .filter()
    .sort()
    .paginate();
  return logQuery.execute();
};

export const systemService = {
  // Users
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  // Notifications
  getAllNotifications,
  createNotification,
  markNotificationRead,
  deleteNotification,
  // Settings
  getAllSettings,
  upsertSetting,
  deleteSetting,
  // Logs
  getAuditLogs,
};
