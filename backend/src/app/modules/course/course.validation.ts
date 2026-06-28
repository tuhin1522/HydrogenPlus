import { z } from "zod";

const createCourseZodSchema = z.object({
  title: z.string({ message: "Title is required" }).min(3, "Title must be at least 3 characters"),
  description: z.string().optional().nullable(),
  classLevelId: z.string({ message: "Class level ID is required" }).uuid("Invalid class level ID"),
  subjectId: z.string({ message: "Subject ID is required" }).uuid("Invalid subject ID"),
  teacherId: z.string({ message: "Teacher ID is required" }).uuid("Invalid teacher ID"),
  price: z.number({ message: "Price is required" }).min(0, "Price cannot be negative"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

const updateCourseZodSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  price: z.number().min(0).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const CourseValidation = {
  createCourseZodSchema,
  updateCourseZodSchema,
};
