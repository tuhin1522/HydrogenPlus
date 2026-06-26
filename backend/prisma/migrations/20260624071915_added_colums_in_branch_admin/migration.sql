/*
  Warnings:

  - A unique constraint covering the columns `[branchId]` on the table `branch_admin_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "branch_admin_profiles_branchId_idx";

-- AlterTable
ALTER TABLE "branch_admin_profiles" ADD COLUMN     "designation" TEXT DEFAULT 'Branch Admin',
ADD COLUMN     "joiningDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "branch_admin_profiles_branchId_key" ON "branch_admin_profiles"("branchId");
