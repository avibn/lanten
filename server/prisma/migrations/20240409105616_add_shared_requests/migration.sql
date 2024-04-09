-- CreateTable
CREATE TABLE "SharedMaintenanceRequest" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "maintenanceRequestId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "SharedMaintenanceRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SharedMaintenanceRequest" ADD CONSTRAINT "SharedMaintenanceRequest_maintenanceRequestId_fkey" FOREIGN KEY ("maintenanceRequestId") REFERENCES "MaintenanceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedMaintenanceRequest" ADD CONSTRAINT "SharedMaintenanceRequest_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
