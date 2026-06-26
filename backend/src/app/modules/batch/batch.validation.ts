import { z } from "zod";

const createBatchZodSchema = z.object({
  name: z.string({ message: "Batch name is required" }).min(2, "Batch name must be at least 2 characters"),
  branchId: z.string({ message: "Branch ID is required" }).uuid("Invalid Branch ID format"),
  classLevelId: z.string({ message: "Class level ID is required" }).uuid("Invalid Class level ID format"),
  capacity: z.number({ message: "Capacity is required" }).int().positive("Capacity must be a positive number"),
  status: z.enum(["ACTIVE", "INACTIVE"] as [string, ...string[]]).optional(),
});

const updateBatchZodSchema = z.object({
  name: z.string().min(2, "Batch name must be at least 2 characters").optional(),
  capacity: z.number().int().positive("Capacity must be a positive number").optional(),
  status: z.enum(["ACTIVE", "INACTIVE"] as [string, ...string[]]).optional(),
});

export const BatchValidation = {
  createBatchZodSchema,
  updateBatchZodSchema,
};
