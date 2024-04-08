/*
  Warnings:

  - A unique constraint covering the columns `[propertyImageId]` on the table `Property` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "propertyImageId" TEXT;

-- CreateTable
CREATE TABLE "PropertyImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_propertyImageId_key" ON "Property"("propertyImageId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_propertyImageId_fkey" FOREIGN KEY ("propertyImageId") REFERENCES "PropertyImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
