import { prisma } from '../../lib/prisma';
import { Batch, BatchStatus } from "@/generated/prisma";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { IQueryParams } from "@/app/interface/query.interface";

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
const getAllBatches = async (query: IQueryParams) => {
  const batchQuery = new QueryBuilder(
      prisma.batch as any,
      query,
      {
          searchableFields: ['name'],
          filterableFields: ['branchId', 'classLevelId', 'status']
      }
  ).search().filter().sort().paginate().fields().dynamicInclude({
      branch: true,
      classLevel: true,
      students: true,
      subjects: true,
  }, ['branch', 'classLevel']);

  const result = await batchQuery.execute();
  return result;
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
