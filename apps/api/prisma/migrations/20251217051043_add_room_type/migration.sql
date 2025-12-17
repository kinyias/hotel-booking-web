/*
  Warnings:

  - You are about to drop the column `imageId` on the `HotelImage` table. All the data in the column will be lost.
  - You are about to drop the column `kind` on the `HotelImage` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `HotelImage` table. All the data in the column will be lost.
  - Added the required column `url` to the `HotelImage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HotelStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "public"."HotelImage" DROP CONSTRAINT "HotelImage_imageId_fkey";

-- DropIndex
DROP INDEX "public"."HotelImage_hotelId_imageId_key";

-- DropIndex
DROP INDEX "public"."HotelImage_hotelId_kind_idx";

-- DropIndex
DROP INDEX "public"."HotelImage_hotelId_position_idx";

-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "status" "HotelStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "HotelImage" DROP COLUMN "imageId",
DROP COLUMN "kind",
DROP COLUMN "position",
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ImageGallery" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,

    CONSTRAINT "ImageGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FolderGallery" (
    "id" TEXT NOT NULL,
    "folderName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FolderGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomType" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_per_night" DECIMAL(12,2) NOT NULL,
    "max_guests" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenity" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Amenity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomTypeAmenity" (
    "typeId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,

    CONSTRAINT "RoomTypeAmenity_pkey" PRIMARY KEY ("typeId","amenityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageGallery_publicId_key" ON "ImageGallery"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "FolderGallery_folderName_key" ON "FolderGallery"("folderName");

-- CreateIndex
CREATE INDEX "RoomType_hotelId_idx" ON "RoomType"("hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomType_hotelId_name_key" ON "RoomType"("hotelId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Amenity_key_key" ON "Amenity"("key");

-- CreateIndex
CREATE INDEX "RoomTypeAmenity_amenityId_idx" ON "RoomTypeAmenity"("amenityId");

-- AddForeignKey
ALTER TABLE "ImageGallery" ADD CONSTRAINT "ImageGallery_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "FolderGallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageGallery" ADD CONSTRAINT "ImageGallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderGallery" ADD CONSTRAINT "FolderGallery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomType" ADD CONSTRAINT "RoomType_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypeAmenity" ADD CONSTRAINT "RoomTypeAmenity_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "RoomType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTypeAmenity" ADD CONSTRAINT "RoomTypeAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
