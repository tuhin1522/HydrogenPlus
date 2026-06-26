/*
  Warnings:

  - You are about to drop the `ClassLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_classLevelId_fkey";

-- DropForeignKey
ALTER TABLE "batch_subjects" DROP CONSTRAINT "batch_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_classLevelId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_classLevelId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_subjectId_fkey";

-- DropTable
DROP TABLE "ClassLevel";

-- DropTable
DROP TABLE "Subject";

-- CreateTable
CREATE TABLE "class_levels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "class_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "classLevelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_levels_name_key" ON "class_levels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_classLevelId_name_key" ON "subjects"("classLevelId", "name");

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "class_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "class_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_subjects" ADD CONSTRAINT "batch_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "class_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
