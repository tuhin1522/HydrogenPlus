import { z } from "zod";

const createBranchAdminZodSchema = z.object({
  userId: z.string({ message: "User ID is required" }).uuid("Invalid User ID format"),
  branchId: z.string({ message: "Branch ID is required" }).uuid("Invalid Branch ID format"),
  joiningDate: z.string().datetime({ offset: true }).optional().nullable(),
  designation: z.string().optional().nullable(),
});

const updateBranchAdminZodSchema = z.object({
  branchId: z.string().uuid("Invalid Branch ID format").optional(),
  joiningDate: z.string().datetime({ offset: true }).optional().nullable(),
  designation: z.string().optional().nullable(),
});

export const BranchAdminValidation = {
  createBranchAdminZodSchema,
  updateBranchAdminZodSchema,
};
