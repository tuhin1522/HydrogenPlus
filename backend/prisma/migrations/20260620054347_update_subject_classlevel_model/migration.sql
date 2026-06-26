/*
  Warnings:

  - You are about to drop the `class_levels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "batch_subjects" DROP CONSTRAINT "batch_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_classLevelId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_classLevelId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_subjectId_fkey";

-- DropTable
DROP TABLE "class_levels";

-- DropTable
DROP TABLE "subjects";

-- CreateTable
CREATE TABLE "ClassLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "classLevelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassLevel_name_key" ON "ClassLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_classLevelId_name_key" ON "Subject"("classLevelId", "name");

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batch_subjects" ADD CONSTRAINT "batch_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_classLevelId_fkey" FOREIGN KEY ("classLevelId") REFERENCES "ClassLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
