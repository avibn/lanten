/*
  Warnings:

  - You are about to drop the column `isRecurring` on the `Payment` table. All the data in the column will be lost.
  - The `recurringInterval` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "recurringInterval" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "isRecurring",
DROP COLUMN "recurringInterval",
ADD COLUMN     "recurringInterval" "recurringInterval" NOT NULL DEFAULT 'NONE';
