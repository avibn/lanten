/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Lease` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCode` to the `Lease` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lease" ADD COLUMN     "inviteCode" TEXT NOT NULL DEFAULT SUBSTRING(gen_random_uuid()::text, 1, 10);

-- CreateIndex
CREATE UNIQUE INDEX "Lease_inviteCode_key" ON "Lease"("inviteCode");
