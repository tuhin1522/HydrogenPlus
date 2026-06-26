import { z } from "zod";

const createStudentProfileZodSchema = z.object({
  batchId: z.string({ message: "Batch ID is required" }).uuid("Invalid Batch ID format"),
  guardianName: z.string({ message: "Guardian name is required" }).min(2, "Guardian name must be at least 2 characters"),
  guardianPhone: z.string({ message: "Guardian phone number is required" }).regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number"),
  schoolName: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  admissionDate: z.coerce.date({ message: "Admission date is required" }),
});

const updateStudentProfileZodSchema = z.object({
  batchId: z.string().uuid("Invalid Batch ID format").optional(),
  guardianName: z.string().min(2, "Guardian name must be at least 2 characters").optional(),
  guardianPhone: z.string().regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, "Please provide a valid Bangladeshi phone number").optional(),
  schoolName: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  admissionDate: z.coerce.date().optional(),
});

export const StudentValidation = {
  createStudentProfileZodSchema,
  updateStudentProfileZodSchema,
};
