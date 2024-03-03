/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `LeaseTenantInvite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteCode` to the `LeaseTenantInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeaseTenantInvite" ADD COLUMN     "inviteCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LeaseTenantInvite_inviteCode_key" ON "LeaseTenantInvite"("inviteCode");
