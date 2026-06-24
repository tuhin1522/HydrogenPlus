import { prisma } from "@/app/lib/prisma";
import { IClassLevel } from "./classLevel.interface";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";
import AppError from "@/app/errorHelpers/appError";
import httpStatus from "http-status";

const createClassLevel = async (payload: IClassLevel) => {
  const { name, branchId } = payload;
  
  const isClassLevelExist = await prisma.classLevel.findUnique({
    where: { name }
  });

  if (isClassLevelExist) {
    throw new AppError(httpStatus.CONFLICT, `Class level with name '${name}' already exists.`);
  }

  await prisma.classLevel.create({
    data: payload,
  });
};

const getAllClassLevels = async (query: IQueryParams) => {
  const classLevelQuery = new QueryBuilder(
    prisma.classLevel as any,
    query,
    {
      searchableFields: ['name'],
      filterableFields: [],
    }
  )
    .search()
    .filter()
    .sort()
    .paginate()
    .fields()
    .dynamicInclude({
      subjects: true,
      batches: true,
      courses: true,
    }, ['subjects', 'batches', 'courses']);

  const result = await classLevelQuery.execute();
  return result;
};

const getClassLevelById = async (id: string) => {
  const classLevel = await prisma.classLevel.findUnique({
    where: { id },
  });
  return classLevel;
};

const updateClassLevel = async (id: string, payload: Partial<IClassLevel>) => {
  const classLevel = await prisma.classLevel.update({
    where: { id },
    data: payload,
  });
  return classLevel;
};

const deleteClassLevel = async (id: string) => {
  const classLevel = await prisma.classLevel.delete({
    where: { id },
  });
  return classLevel;
};

export const classLevelService = {
  createClassLevel,
  getAllClassLevels,
  getClassLevelById,
  updateClassLevel,
  deleteClassLevel,
};