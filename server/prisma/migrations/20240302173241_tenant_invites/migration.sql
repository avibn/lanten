-- CreateTable
CREATE TABLE "LeaseTenantInvite" (
    "id" TEXT NOT NULL,
    "emai" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leaseId" TEXT,

    CONSTRAINT "LeaseTenantInvite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeaseTenantInvite" ADD CONSTRAINT "LeaseTenantInvite_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE SET NULL ON UPDATE CASCADE;
