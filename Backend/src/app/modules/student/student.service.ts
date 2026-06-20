import { prisma } from '../../lib/prisma';

/**
 * Get the logged-in student's own profile by userId from JWT
 */
const getMyProfile = async (userId: string) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          emailVerified: true,
          isActive: true,
          createdAt: true,
        },
      },
      batch: {
        select: {
          id: true,
          name: true,
          status: true,
          classLevel: {
            select: { id: true, name: true },
          },
          branch: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  if (!profile) {
    throw new Error('Student profile not found');
  }

  return profile;
};

/**
 * Update the logged-in student's own profile (only allowed fields)
 */
const updateMyProfile = async (
  userId: string,
  data: {
    guardianName?: string;
    guardianPhone?: string;
    schoolName?: string;
    address?: string;
  }
) => {
  const existing = await prisma.studentProfile.findUnique({ where: { userId } });

  if (!existing) {
    throw new Error('Student profile not found');
  }

  const updated = await prisma.studentProfile.update({
    where: { userId },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
      batch: {
        select: {
          id: true,
          name: true,
          classLevel: { select: { id: true, name: true } },
          branch: { select: { id: true, name: true } },
        },
      },
    },
  });

  return updated;
};

/**
 * Get all students (for Branch Admin / Super Admin)
 */
const getAllStudents = async () => {
  const students = await prisma.studentProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
        },
      },
      batch: {
        select: {
          id: true,
          name: true,
          classLevel: { select: { name: true } },
          branch: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return students;
};

/**
 * Get a single student by their StudentProfile ID (for admin)
 */
const getStudentById = async (id: string) => {
  const student = await prisma.studentProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          isActive: true,
          createdAt: true,
        },
      },
      batch: {
        select: {
          id: true,
          name: true,
          classLevel: { select: { id: true, name: true } },
          branch: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  return student;
};

export const studentService = {
  getMyProfile,
  updateMyProfile,
  getAllStudents,
  getStudentById,
};
