/*
  Warnings:

  - Added the required column `dueDate` to the `Borrow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Borrow" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "extended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fineAmount" DOUBLE PRECISION,
ADD COLUMN     "handledBy" INTEGER,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'dipinjam';
