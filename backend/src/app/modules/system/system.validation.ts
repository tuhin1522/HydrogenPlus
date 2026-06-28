import { z } from "zod";
import { UserRole } from "@/generated/prisma";

const createUserZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT], {
    message: "Invalid role. SUPER_ADMIN cannot be created via API.",
  }),
});

const updateUserZodSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^(?:\+880|880|0)1[3-9]\d{8}$/).optional(),
  role: z.enum([UserRole.BRANCH_ADMIN, UserRole.TEACHER, UserRole.STUDENT]).optional(),
  isActive: z.boolean().optional(),
});

const updateUserStatusZodSchema = z.object({
  isActive: z.boolean({ message: "isActive is required" }),
});

const createNotificationZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.string().optional(),
  userId: z.string().uuid().optional(),
});

const upsertSettingZodSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
});

export const SystemValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  updateUserStatusZodSchema,
  createNotificationZodSchema,
  upsertSettingZodSchema,
};
