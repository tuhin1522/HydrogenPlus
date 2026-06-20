export type DayOfWeek =
  | 'SATURDAY'
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY';

export interface IGenerateRoutine {
  branchId: string;
  /** If true, clears existing routines for the branch before generating */
  clearExisting?: boolean;
  /**
   * Working days to schedule classes on.
   * Defaults to SAT–THU (Bangladesh school week).
   */
  workDays?: DayOfWeek[];
  /**
   * Starting hour (24h). Default: 9 (9:00 AM)
   */
  startHour?: number;
  /**
   * Ending hour (24h, exclusive). Default: 16 (4:00 PM → last slot 15:00–16:00)
   */
  endHour?: number;
}

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
