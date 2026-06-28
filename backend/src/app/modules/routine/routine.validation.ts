import { z } from "zod";

const DAY_VALUES = [
  "SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY",
] as const;

/** POST /api/v1/routines/generate — trigger auto-generation for a branch */
const generateRoutineZodSchema = z.object({
  branchId: z.string({ message: "Branch ID is required" }).uuid("Invalid Branch ID format"),
  clearExisting: z.boolean().optional().default(false),
  workDays: z.array(z.enum(DAY_VALUES)).optional(),
  startHour: z.number().int().min(0).max(23).optional(),
  endHour: z.number().int().min(1).max(24).optional(),
});

/** POST /api/v1/routines — manually add a single routine slot */
const createRoutineZodSchema = z.object({
  branchId: z.string({ message: "Branch ID is required" }).uuid("Invalid Branch ID format"),
  batchId: z.string({ message: "Batch ID is required" }).uuid("Invalid Batch ID format"),
  batchSubjectId: z.string({ message: "Batch Subject ID is required" }).uuid("Invalid Batch Subject ID format"),
  room: z.string({ message: "Room is required" }).min(1, "Room cannot be empty"),
  dayOfWeek: z.enum(DAY_VALUES, { message: "Invalid day of week" }),
  startTime: z.coerce.date({ message: "Start time is required" }),
  endTime: z.coerce.date({ message: "End time is required" }),
});

/** PATCH /api/v1/routines/:id — update a routine slot */
const updateRoutineZodSchema = z.object({
  branchId: z.string().uuid("Invalid Branch ID format").optional(),
  batchId: z.string().uuid("Invalid Batch ID format").optional(),
  batchSubjectId: z.string().uuid("Invalid Batch Subject ID format").optional(),
  room: z.string().min(1, "Room cannot be empty").optional(),
  dayOfWeek: z.enum(DAY_VALUES, { message: "Invalid day of week" }).optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

export const RoutineValidation = {
  generateRoutineZodSchema,
  createRoutineZodSchema,
  updateRoutineZodSchema,
};
