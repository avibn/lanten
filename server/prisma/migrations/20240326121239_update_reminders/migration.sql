/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `isSent` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Reminder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "createdAt",
DROP COLUMN "isSent",
DROP COLUMN "message",
DROP COLUMN "updatedAt",
ADD COLUMN     "recurring" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "daysBefore" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ReminderSent" (
    "id" TEXT NOT NULL,
    "sentDate" TIMESTAMP(3) NOT NULL,
    "reminderId" TEXT NOT NULL,

    CONSTRAINT "ReminderSent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReminderSent" ADD CONSTRAINT "ReminderSent_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "Reminder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
