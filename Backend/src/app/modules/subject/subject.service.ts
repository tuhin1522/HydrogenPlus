import { prisma } from "@/app/lib/prisma";
import AppError from "@/app/errorHelpers/appError";
import { ISubject } from "./subject.interface";
import status from "http-status";

const createSubject = async (payload: ISubject) => {
  // Verify ClassLevel exists before creating Subject
  const classExists = await prisma.classLevel.findUnique({
    where: {
      id: payload.classLevelId,
    },
  });

  if (!classExists) {
    throw new AppError(status.NOT_FOUND, "Class level not found");
  }

  // Prevent duplicate subject names within the same class level (case-insensitive check)
  const duplicate = await prisma.subject.findFirst({
    where: {
      classLevelId: payload.classLevelId,
      name: {
        equals: payload.name,
        mode: "insensitive",
      },
    },
  });

  if (duplicate) {
    throw new AppError(status.BAD_REQUEST, "Subject name already exists in this class level");
  }

  return prisma.subject.create({
    data: {
      name: payload.name,
      code: payload.code,
      classLevelId: payload.classLevelId,
    },
    include: {
      classLevel: true,
    },
  });
};

const getAllSubjects = async (query: {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search || "";
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const whereConditions: any = {};
  if (search) {
    whereConditions.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  const [data, total] = await Promise.all([
    prisma.subject.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        classLevel: true,
      },
    }),
    prisma.subject.count({
      where: whereConditions,
    }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getSubjectById = async (id: string) => {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      classLevel: true,
    },
  });

  if (!subject) {
    throw new AppError(status.NOT_FOUND, "Subject not found");
  }

  return subject;
};

const getSubjectsByClass = async (classLevelId: string) => {
  // Verify class level exists
  const classExists = await prisma.classLevel.findUnique({
    where: { id: classLevelId },
  });

  if (!classExists) {
    throw new AppError(status.NOT_FOUND, "Class level not found");
  }

  return prisma.subject.findMany({
    where: {
      classLevelId,
    },
    include: {
      classLevel: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

const updateSubject = async (id: string, payload: Partial<ISubject>) => {
  // Verify Subject exists
  const existingSubject = await prisma.subject.findUnique({
    where: { id },
  });

  if (!existingSubject) {
    throw new AppError(status.NOT_FOUND, "Subject not found");
  }

  const targetClassLevelId = payload.classLevelId || existingSubject.classLevelId;

  // Verify target ClassLevel exists if classLevelId is being updated
  if (payload.classLevelId) {
    const classExists = await prisma.classLevel.findUnique({
      where: { id: payload.classLevelId },
    });
    if (!classExists) {
      throw new AppError(status.NOT_FOUND, "Class level not found");
    }
  }

  // Prevent duplicate subject names within the same class level (case-insensitive check)
  if (payload.name || payload.classLevelId) {
    const targetName = payload.name || existingSubject.name;
    const duplicate = await prisma.subject.findFirst({
      where: {
        classLevelId: targetClassLevelId,
        name: {
          equals: targetName,
          mode: "insensitive",
        },
        id: {
          not: id,
        },
      },
    });

    if (duplicate) {
      throw new AppError(status.BAD_REQUEST, "Subject name already exists in this class level");
    }
  }

  return prisma.subject.update({
    where: { id },
    data: payload,
    include: {
      classLevel: true,
    },
  });
};

const deleteSubject = async (id: string) => {
  // Verify Subject exists
  const existingSubject = await prisma.subject.findUnique({
    where: { id },
  });

  if (!existingSubject) {
    throw new AppError(status.NOT_FOUND, "Subject not found");
  }

  // Do not delete if related BatchSubject exists
  const relatedBatchSubject = await prisma.batchSubject.findFirst({
    where: { subjectId: id },
  });

  if (relatedBatchSubject) {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot delete subject because it is associated with a BatchSubject"
    );
  }

  // Do not delete if related Course exists
  const relatedCourse = await prisma.course.findFirst({
    where: { subjectId: id },
  });

  if (relatedCourse) {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot delete subject because it is associated with a Course"
    );
  }

  return prisma.subject.delete({
    where: { id },
  });
};

export const subjectService = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  getSubjectsByClass,
  updateSubject,
  deleteSubject,
};