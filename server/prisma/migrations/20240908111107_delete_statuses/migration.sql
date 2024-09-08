/*
  Warnings:

  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Status" DROP CONSTRAINT "Status_userId_fkey";

-- DropTable
DROP TABLE "Status";

-- DropEnum
DROP TYPE "StatusType";
