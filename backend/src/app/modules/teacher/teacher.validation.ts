import { z } from "zod";

const createTeacherZodSchema = z.object({
  userId: z.string({ message: "User ID is required" }).uuid("Invalid User ID format"),
  branchId: z.string({ message: "Branch ID is required" }).uuid("Invalid Branch ID format"),
  qualification: z.string().optional().nullable(),
  experience: z.coerce.number().int().nonnegative("Experience cannot be negative").optional().nullable(),
  specialization: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

const updateTeacherZodSchema = z.object({
  userId: z.string().uuid("Invalid User ID format").optional(),
  branchId: z.string().uuid("Invalid Branch ID format").optional(),
  qualification: z.string().optional().nullable(),
  experience: z.coerce.number().int().nonnegative("Experience cannot be negative").optional().nullable(),
  specialization: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const TeacherValidation = {
  createTeacherZodSchema,
  updateTeacherZodSchema,
};
