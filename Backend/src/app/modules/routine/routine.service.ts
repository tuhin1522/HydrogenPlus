import { prisma } from "@/app/lib/prisma";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";
import { ICreateRoutine } from "./routine.interface";


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
  createRoutine,
  getAllRoutines,
  getRoutineById,
  getBatchSchedule,
  deleteRoutine,
  clearBranchRoutines,
};
