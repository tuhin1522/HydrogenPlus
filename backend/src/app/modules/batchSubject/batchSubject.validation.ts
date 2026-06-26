import { z } from "zod";

const createBatchSubjectZodSchema = z.object({
    batchId: z.string({ message: "Batch ID is required" }).uuid("Invalid Batch ID format"),
    subjectId: z.string({ message: "Subject ID is required" }).uuid("Invalid Subject ID format"),
    teacherId: z.string({ message: "Teacher ID is required" }).uuid("Invalid Teacher ID format"),
});

export const BatchSubjectValidation = {
    createBatchSubjectZodSchema,
};  