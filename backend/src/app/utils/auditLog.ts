import { prisma } from "@/app/lib/prisma";

export const createAuditLog = async (payload: {
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  userId?: string;
}) => {
  try {
    await prisma.auditLog.create({ data: payload });
  } catch {
    // Audit logging should not block primary operations
  }
};
