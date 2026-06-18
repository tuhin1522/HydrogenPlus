/*
  Warnings:

  - You are about to drop the column `branchId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_branchId_fkey";

-- DropIndex
DROP INDEX "users_branchId_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "branchId",
DROP COLUMN "role";
