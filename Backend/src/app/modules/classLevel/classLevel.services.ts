import { prisma } from "@/app/lib/prisma";
import { IClassLevel } from "./classLevel.interface";

const createClassLevel = async (payload: IClassLevel) => {
  const { name, branchId } = payload;
  await prisma.classLevel.create({
    data: payload,
  });
};

const getAllClassLevels = async () => {
  const classLevels = await prisma.classLevel.findMany();
  return classLevels;
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