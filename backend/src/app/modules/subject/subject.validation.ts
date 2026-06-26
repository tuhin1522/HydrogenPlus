import { z } from "zod";

const createSubjectZodSchema = z.object({
  name: z.string({ message: "Subject name is required" }).min(1, "Subject name cannot be empty"),
  classLevelId: z.string({ message: "Class level ID is required" }).uuid("Invalid Class Level ID format"),
  code: z.string().optional().nullable(),
});

const updateSubjectZodSchema = z.object({
  name: z.string().min(1, "Subject name cannot be empty").optional(),
  code: z.string().optional().nullable(),
});

export const SubjectValidation = {
  createSubjectZodSchema,
  updateSubjectZodSchema,
};
