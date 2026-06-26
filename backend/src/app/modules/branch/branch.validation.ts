import { z } from "zod";

const createBranchZodSchema = z.object({
  name: z.string({ message: "Branch name is required" }).min(2, "Branch name must be at least 2 characters"),
  managerName: z.string({ message: "Manager name is required" }).min(2, "Manager name must be at least 2 characters"),
  address: z.string({ message: "Address is required" }).min(5, "Address must be at least 5 characters"),
  phone: z.string({ message: "Phone number is required" }).regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),
  email: z.string().email("Invalid email address").optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"] as [string, ...string[]]).optional(),
});

const updateBranchZodSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters").optional(),
  managerName: z.string().min(2, "Manager name must be at least 2 characters").optional(),
  address: z.string().min(5, "Address must be at least 5 characters").optional(),
  phone: z.string().regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number").optional(),
  email: z.string().email("Invalid email address").optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"] as [string, ...string[]]).optional(),
});

export const BranchValidation = {
  createBranchZodSchema,
  updateBranchZodSchema,
};
