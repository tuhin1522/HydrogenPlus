import { DayOfWeek } from "@/generated/prisma";


export interface ICreateRoutine {
  branchId: string;
  batchId: string;
  batchSubjectId: string;
  room: string;
  dayOfWeek: DayOfWeek;
  startTime: Date;
  endTime: Date;
}

export interface ITimeSlot {
  day: DayOfWeek;
  hour: number; // 24-hour start hour
}
