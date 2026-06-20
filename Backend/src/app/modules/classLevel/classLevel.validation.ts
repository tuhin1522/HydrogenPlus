import { z } from "zod";

const createClassLevelZodSchema = z.object({
  name: z.string({ message: "Class Level name is required" }).min(1, "Class Level name must be at least 1 character"),
  branchId: z.string().uuid("Invalid Branch ID format").optional(),
});

const updateClassLevelZodSchema = z.object({
  name: z.string().min(1, "Class Level name must be at least 1 character").optional(),
  branchId: z.string().uuid("Invalid Branch ID format").optional(),
});

export const ClassLevelValidation = {
  createClassLevelZodSchema,
  updateClassLevelZodSchema,
};
