import { prisma } from "@/app/lib/prisma";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";
import { ICreateSubject, IUpdateSubject } from "./subject.interface";
import AppError from "@/app/errorHelpers/appError";
import status from "http-status";

const createSubject = async (payload: ICreateSubject) => {
  const { name, classLevelId, code } = payload;

  const classLevel = await (prisma.classLevel as any).findUnique({
    where: { id: classLevelId },
  });
  if (!classLevel) {
    throw new Error("Class level not found");
  }
  // Prevent duplicate subject within the same class level
  const existing = await (prisma.subject as any).findFirst({
    where: { name, classLevelId },
  });
  if (existing) {
    throw new Error(`Subject "${name}" already exists in this class level`);
  }

  const subject = await (prisma.subject as any).create({
    data: { name, classLevelId, code },
    include: {
      classLevel: true,
    },
  });

  return subject;
};

const getAllSubjects = async (query: IQueryParams) => {
  const subjectQuery = new QueryBuilder(
    prisma.subject as any,
    query,
    {
      searchableFields: ["name", "code"],
      filterableFields: ["classLevelId"],
    }
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .fields()
    .dynamicInclude(
      {
        classLevel: true,
        batchSubjects: {
          include: {
            teacher: {
              select: {
                id: true,
                user: { select: { id: true, name: true, email: true } },
              },
            },
            batch: { select: { id: true, name: true } },
          },
        },
        courses: true,
      },
      ["classLevel"]
    );

  return subjectQuery.execute();
};

/**
 * Get a single subject by ID with full relations.
 */
const getSubjectById = async (id: string) => {
  const subject = await (prisma.subject as any).findUnique({
    where: { id },
    include: {
      classLevel: true,
      batchSubjects: {
        include: {
          teacher: {
            select: {
              id: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
          batch: { select: { id: true, name: true } },
        },
      },
      courses: true,
    },
  });

  if (!subject) {
    throw new AppError(status.NOT_FOUND, "Subject not found");
  }

  return subject;
};

/**
 * Update a subject's name or code only.
 * classLevelId is immutable after creation.
 */
const updateSubject = async (id: string, payload: IUpdateSubject) => {
  await getSubjectById(id); // ensures it exists

  const subject = await (prisma.subject as any).update({
    where: { id },
    data: payload,
    include: { classLevel: true },
  });

  return subject;
};

/**
 * Delete a subject by ID.
 */
const deleteSubject = async (id: string) => {
  await getSubjectById(id); // ensures it exists

  const subject = await (prisma.subject as any).delete({
    where: { id },
  });

  return subject;
};

export const subjectService = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
