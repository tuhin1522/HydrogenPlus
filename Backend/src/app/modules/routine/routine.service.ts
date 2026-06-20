import { prisma } from "@/app/lib/prisma";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";
import { DayOfWeek, ICreateRoutine, IGenerateRoutine, ITimeSlot } from "./routine.interface";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Default working days (Bangladesh: Sat–Thu) */
const DEFAULT_WORK_DAYS: DayOfWeek[] = [
  "SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY",
];

/** Default class window: 09:00 – 16:00 (7 one-hour slots) */
const DEFAULT_START_HOUR = 9;
const DEFAULT_END_HOUR = 16;

/**
 * A fixed reference date used so that `startTime` / `endTime` in the DB
 * represent *clock times* only.  The date part is always 2000-01-01.
 */
const REFERENCE_DATE = "2000-01-01";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a DateTime that encodes only a wall-clock hour on the reference date */
function toSlotTime(hour: number): Date {
  return new Date(`${REFERENCE_DATE}T${String(hour).padStart(2, "0")}:00:00.000Z`);
}

/**
 * Build the ordered list of every possible (day, hour) slot across the week.
 * Slots are ordered Monday-style so subjects are spread evenly across the week
 * before doubling up on the same day.
 *
 * Strategy: interleave days first (SAT@9, SUN@9, …, SAT@10, SUN@10, …)
 * so that if a batch has N subjects it gets one subject per day before any day
 * gets a second class.
 */
function buildSlotQueue(workDays: DayOfWeek[], startHour: number, endHour: number): ITimeSlot[] {
  const slots: ITimeSlot[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (const day of workDays) {
      slots.push({ day, hour });
    }
  }
  return slots;
}

// ─── Core: auto-generation ────────────────────────────────────────────────────

/**
 * Automatically generates a weekly routine for all active batches in a branch.
 *
 * Algorithm
 * ─────────
 * 1.  Fetch all ACTIVE batches for the branch, sorted by student count DESC
 *     (priority: larger batches get earlier / more desirable slots).
 * 2.  Build an ordered slot queue (interleaved day-first to spread load).
 * 3.  For each batch (highest-priority first):
 *     a. Assign each of its BatchSubjects (subject + teacher) to the first
 *        available slot that satisfies ALL three constraints:
 *        • The batch has no class at that slot (batch conflict).
 *        • The teacher has no class at that slot (teacher conflict).
 *        • The room assigned to the batch is free at that slot (room conflict).
 *     b. Each batch gets its own dedicated room based on priority rank.
 * 4.  Bulk-insert all generated records.
 */
const generateRoutine = async (payload: IGenerateRoutine) => {
  const {
    branchId,
    clearExisting = false,
    workDays = DEFAULT_WORK_DAYS,
    startHour = DEFAULT_START_HOUR,
    endHour = DEFAULT_END_HOUR,
  } = payload;

  // Validate branch
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) throw new Error("Branch not found");

  // Optionally clear previous routines
  if (clearExisting) {
    await prisma.routine.deleteMany({ where: { branchId } });
  }

  // ── Step 1: Fetch batches sorted by student count (priority) ──────────────
  const batches = await (prisma.batch as any).findMany({
    where: { branchId, status: "ACTIVE" },
    include: {
      _count: { select: { students: true } },
      subjects: {
        include: { teacher: true, subject: true },
      },
    },
    orderBy: { students: { _count: "desc" } },
  });

  if (batches.length === 0) {
    throw new Error(
      "No active batches found for this branch. Create batches and assign subjects before generating routines."
    );
  }

  // ── Step 2: Build slot queue ───────────────────────────────────────────────
  const slotQueue = buildSlotQueue(workDays, startHour, endHour);
  const totalSlots = slotQueue.length;

  // ── Step 3: Track conflicts ────────────────────────────────────────────────
  // usedSlots[slotKey] = { batchIds, teacherIds, roomNos }
  const usedSlots = new Map<string, { batchIds: Set<string>; teacherIds: Set<string>; roomNos: Set<string> }>();

  const getOrInit = (key: string) => {
    if (!usedSlots.has(key)) {
      usedSlots.set(key, { batchIds: new Set(), teacherIds: new Set(), roomNos: new Set() });
    }
    return usedSlots.get(key)!;
  };

  // Assign deterministic room names by priority rank (index 0 = most students)
  const batchRooms = new Map<string, string>();
  batches.forEach((batch: any, idx: number) => {
    // Room-101, Room-102 … — easy to read, sortable
    batchRooms.set(batch.id, `Room-${String(101 + idx)}`);
  });

  const routinesToCreate: ICreateRoutine[] = [];
  const unscheduled: Array<{ batchName: string; subjectName: string }> = [];

  // ── Step 4: Schedule each batch's subjects ────────────────────────────────
  for (const batch of batches) {
    const room = batchRooms.get(batch.id)!;

    if (!batch.subjects || batch.subjects.length === 0) continue;

    for (const batchSubject of batch.subjects) {
      let assigned = false;

      for (let si = 0; si < totalSlots; si++) {
        const slot = slotQueue[si];
        const slotKey = `${slot.day}-${slot.hour}`;
        const info = getOrInit(slotKey);

        // Constraint A: same batch cannot have two classes at the same time
        if (info.batchIds.has(batch.id)) continue;

        // Constraint B: same teacher cannot teach two classes at the same time
        if (info.teacherIds.has(batchSubject.teacherId)) continue;

        // Constraint C: same room cannot have two classes at the same time
        if (info.roomNos.has(room)) continue;

        // ── Slot is available — claim it ─────────────────────────────────
        info.batchIds.add(batch.id);
        info.teacherIds.add(batchSubject.teacherId);
        info.roomNos.add(room);

        routinesToCreate.push({
          branchId,
          batchId: batch.id,
          batchSubjectId: batchSubject.id,
          room,
          dayOfWeek: slot.day,
          startTime: toSlotTime(slot.hour),
          endTime: toSlotTime(slot.hour + 1),
        });

        assigned = true;
        break;
      }

      if (!assigned) {
        unscheduled.push({
          batchName: batch.name,
          subjectName: batchSubject.subject?.name ?? batchSubject.subjectId,
        });
      }
    }
  }

  // ── Step 5: Bulk insert ───────────────────────────────────────────────────
  if (routinesToCreate.length === 0) {
    throw new Error(
      "No routines could be generated. Make sure batches have BatchSubjects (assigned subjects with teachers)."
    );
  }

  await (prisma.routine as any).createMany({
    data: routinesToCreate,
    skipDuplicates: true,
  });

  return {
    generated: routinesToCreate.length,
    unscheduled: unscheduled.length,
    unscheduledDetails: unscheduled,
    message:
      unscheduled.length > 0
        ? `${routinesToCreate.length} routines generated. ${unscheduled.length} subject(s) could not be scheduled (insufficient time slots). Consider adding more working days or extending hours.`
        : `${routinesToCreate.length} routines generated successfully for all batches.`,
  };
};

// ─── Manual create ─────────────────────────────────────────────────────────────

const createRoutine = async (payload: ICreateRoutine) => {
  // Validate foreign keys
  const [branch, batch, batchSubject] = await Promise.all([
    prisma.branch.findUnique({ where: { id: payload.branchId } }),
    prisma.batch.findUnique({ where: { id: payload.batchId } }),
    (prisma.batchSubject as any).findUnique({ where: { id: payload.batchSubjectId } }),
  ]);

  if (!branch) throw new Error("Branch not found");
  if (!batch) throw new Error("Batch not found");
  if (!batchSubject) throw new Error("Batch subject not found");

  // Check for batch conflict (same batch, same day, overlapping time)
  const batchConflict = await (prisma.routine as any).findFirst({
    where: {
      batchId: payload.batchId,
      dayOfWeek: payload.dayOfWeek,
      startTime: payload.startTime,
    },
  });
  if (batchConflict) {
    throw new Error("This batch already has a class at this time on this day");
  }

  // Check teacher conflict
  const teacherConflict = await (prisma.routine as any).findFirst({
    where: {
      batchSubject: { teacherId: batchSubject.teacherId },
      dayOfWeek: payload.dayOfWeek,
      startTime: payload.startTime,
    },
  });
  if (teacherConflict) {
    throw new Error("The assigned teacher already has a class at this time on this day");
  }

  const routine = await (prisma.routine as any).create({
    data: payload,
    include: {
      branch: { select: { id: true, name: true } },
      batch: { select: { id: true, name: true } },
      batchSubject: {
        include: {
          subject: { select: { id: true, name: true } },
          teacher: { select: { id: true, user: { select: { name: true } } } },
        },
      },
    },
  });

  return routine;
};

// ─── Query / read ──────────────────────────────────────────────────────────────

const getAllRoutines = async (query: IQueryParams) => {
  const routineQuery = new QueryBuilder(
    prisma.routine as any,
    query,
    {
      searchableFields: ["room"],
      filterableFields: ["branchId", "batchId", "dayOfWeek"],
    }
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .fields()
    .dynamicInclude(
      {
        branch: { select: { id: true, name: true } },
        batch: { select: { id: true, name: true, classLevel: { select: { id: true, name: true } } } },
        batchSubject: {
          include: {
            subject: { select: { id: true, name: true, code: true } },
            teacher: {
              select: {
                id: true,
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
      ["branch", "batch", "batchSubject"]
    );

  return routineQuery.execute();
};

const getRoutineById = async (id: string) => {
  const routine = await (prisma.routine as any).findUnique({
    where: { id },
    include: {
      branch: { select: { id: true, name: true } },
      batch: { select: { id: true, name: true } },
      batchSubject: {
        include: {
          subject: { select: { id: true, name: true, code: true } },
          teacher: {
            select: {
              id: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      },
    },
  });

  if (!routine) throw new Error("Routine not found");
  return routine;
};

/** Get the full weekly schedule for a specific batch — grouped by day */
const getBatchSchedule = async (batchId: string) => {
  const batch = await prisma.batch.findUnique({ where: { id: batchId } });
  if (!batch) throw new Error("Batch not found");

  const routines = await (prisma.routine as any).findMany({
    where: { batchId },
    include: {
      batchSubject: {
        include: {
          subject: { select: { id: true, name: true, code: true } },
          teacher: {
            select: {
              id: true,
              user: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  // Group by day
  const schedule: Record<string, typeof routines> = {};
  for (const r of routines) {
    if (!schedule[r.dayOfWeek]) schedule[r.dayOfWeek] = [];
    schedule[r.dayOfWeek].push(r);
  }

  return { batch, schedule };
};

// ─── Delete ────────────────────────────────────────────────────────────────────

const deleteRoutine = async (id: string) => {
  await getRoutineById(id);
  return (prisma.routine as any).delete({ where: { id } });
};

/** Clear all routines for a branch (usually before re-generating) */
const clearBranchRoutines = async (branchId: string) => {
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) throw new Error("Branch not found");

  const { count } = await prisma.routine.deleteMany({ where: { branchId } });
  return { deleted: count, message: `${count} routines cleared for branch "${branch.name}"` };
};

// ─── Export ────────────────────────────────────────────────────────────────────

export const routineService = {
  generateRoutine,
  createRoutine,
  getAllRoutines,
  getRoutineById,
  getBatchSchedule,
  deleteRoutine,
  clearBranchRoutines,
};
