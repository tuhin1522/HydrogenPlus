/*
  Warnings:

  - You are about to drop the column `subjectId` on the `routines` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `routines` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[branchId,name]` on the table `batches` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `batch_subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batchSubjectId` to the `routines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `teacher_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "batch_subjects" DROP CONSTRAINT "batch_subjects_batchId_fkey";

-- DropForeignKey
ALTER TABLE "batch_subjects" DROP CONSTRAINT "batch_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "batch_subjects" DROP CONSTRAINT "batch_subjects_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_branchId_fkey";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_classLevelId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_classLevelId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "routines" DROP CONSTRAINT "routines_batchId_fkey";

-- DropForeignKey
ALTER TABLE "routines" DROP CONSTRAINT "routines_branchId_fkey";

-- DropForeignKey
ALTER TABLE "routines" DROP CONSTRAINT "routines_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "routines" DROP CONSTRAINT "routines_teacherId_fkey";

-- DropIndex
DROP INDEX "routines_room_idx";

-- DropIndex
DROP INDEX "routines_teacherId_idx";

-- AlterTable
ALTER TABLE "batch_subjects" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "routines" DROP COLUMN "subjectId",
DROP COLUMN "teacherId",
ADD COLUMN     "batchSubjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teacher_profiles" ADD COLUMN     "branchId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL;

-- CreateTable
CREATE TABLE "branch_admin_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_admin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branch_admin_profiles_userId_key" ON "branch_admin_profiles"("userId");

-- CreateIndex
CREATE INDEX "branch_admin_profiles_branchId_idx" ON "branch_admin_profiles"("branchId");

-- CreateIndex
CREATE INDEX "batch_subjects_batchId_idx" ON "batch_subjects"("batchId");

-- CreateIndex
CREATE INDEX "batch_subjects_subjectId_idx" ON "batch_subjects"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "batches_branchId_name_key" ON "batches"("branchId", "name");

-- CreateIndex
CREATE INDEX "routines_branchId_idx" ON "routines"("branchId");

-- CreateIndex
CREATE INDEX "routines_batchSubjectId_idx" ON "routines"("batchSubjectId");

-- CreateIndex
CREATE INDEX "teacher_profiles_branchId_idx" ON "teacher_profiles"("branchId");

-- AddForeignKey
ALTER TABLE "branch_admin_profiles" ADD CONSTRAINT "branch_admin_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_admin_profiles" ADD CONSTRAINT "branch_admin_profiles_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "class_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "teacher_profiles_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_subjects" ADD CONSTRAINT "batch_subjects_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_subjects" ADD CONSTRAINT "batch_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_subjects" ADD CONSTRAINT "batch_subjects_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "class_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_batchSubjectId_fkey" FOREIGN KEY ("batchSubjectId") REFERENCES "batch_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
