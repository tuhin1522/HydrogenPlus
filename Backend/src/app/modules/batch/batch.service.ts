import { prisma } from '../../lib/prisma';
import { Batch, BatchStatus } from "@/generated/prisma";

/**
 * Create a new batch
 */
const createBatch = async (data: {
  name: string;
  branchId: string;
  classLevelId: string;
  capacity: number;
  status?: BatchStatus;
}): Promise<Batch> => {
  try {
    const batch = await prisma.batch.create({
      data: {
        name: data.name,
        branchId: data.branchId,
        classLevelId: data.classLevelId,
        capacity: data.capacity,
        status: data.status || 'ACTIVE',
      },
      include: {
        branch: true,
        classLevel: true,
      },
    });

    return batch;
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      throw new Error('A batch with this name already exists in this branch');
    }
    throw error;
  }
};

/**
 * Get all batches with optional filtering
 */
const getAllBatches = async (filters?: {
  branchId?: string;
  classLevelId?: string;
  status?: BatchStatus;
  skip?: number;
  take?: number;
}): Promise<{ batches: Batch[]; total: number }> => {
  const skip = filters?.skip || 0;
  const take = filters?.take || 10;

  const where: any = {};

  if (filters?.branchId) {
    where.branchId = filters.branchId;
  }

  if (filters?.classLevelId) {
    where.classLevelId = filters.classLevelId;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  const [batches, total] = await Promise.all([
    prisma.batch.findMany({
      where,
      include: {
        branch: true,
        classLevel: true,
        students: true,
        subjects: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.batch.count({ where }),
  ]);

  return { batches, total };
};

/**
 * Get batch by ID
 */
const getBatchById = async (id: string): Promise<Batch | null> => {
  const batch = await prisma.batch.findUnique({
    where: { id },
    include: {
      branch: true,
      classLevel: true,
      students: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      subjects: {
        include: {
          subject: true,
        },
      },
      routines: true,
    },
  });

  if (!batch) {
    throw new Error('Batch not found');
  }

  return batch;
};

/**
 * Update batch
 */
const updateBatch = async (
  id: string,
  updateData: {
    name?: string;
    capacity?: number;
    status?: BatchStatus;
  }
): Promise<Batch> => {
  try {
    // Check if batch exists
    await getBatchById(id);

    const batch = await prisma.batch.update({
      where: { id },
      data: {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.capacity && { capacity: updateData.capacity }),
        ...(updateData.status && { status: updateData.status }),
      },
      include: {
        branch: true,
        classLevel: true,
      },
    });

    return batch;
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('A batch with this name already exists in this branch');
    }
    throw error;
  }
};

/**
 * Delete batch
 */
const deleteBatch = async (id: string): Promise<Batch> => {
  try {
    // Check if batch exists
    await getBatchById(id);

    const batch = await prisma.batch.delete({
      where: { id },
      include: {
        branch: true,
        classLevel: true,
      },
    });

    return batch;
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('Batch not found');
    }
    throw error;
  }
};

export const batchService = {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
};
