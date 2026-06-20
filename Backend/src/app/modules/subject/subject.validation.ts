import { z } from "zod";

const createSubjectSchema = z.object({
  name: z.string({
    message: "Name is required",
  }).min(2, "Name must be at least 2 characters long"),
  code: z.string().optional(),
  classLevelId: z.string({
    message: "classLevelId is required",
  }).uuid("Invalid classLevelId format"),
});

const updateSubjectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").optional(),
  code: z.string().optional(),
  classLevelId: z.string().uuid("Invalid classLevelId format").optional(),
});

export const subjectValidation = {
  createSubjectSchema,
  updateSubjectSchema,
};

// Direct exports for route usage and compatibility
export {
  createSubjectSchema,
  updateSubjectSchema,
};