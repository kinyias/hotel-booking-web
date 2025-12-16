/*
  Warnings:

  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `District` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Province` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ward` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "HotelMemberRole" AS ENUM ('OWNER', 'MANAGER', 'STAFF');

-- DropForeignKey
ALTER TABLE "public"."District" DROP CONSTRAINT "District_provinceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Province" DROP CONSTRAINT "Province_countryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ward" DROP CONSTRAINT "Ward_districtId_fkey";

-- DropTable
DROP TABLE "public"."Country";

-- DropTable
DROP TABLE "public"."District";

-- DropTable
DROP TABLE "public"."Province";

-- DropTable
DROP TABLE "public"."Ward";

-- CreateTable
CREATE TABLE "Hotel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hotel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelMember" (
    "hotelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "HotelMemberRole" NOT NULL DEFAULT 'MANAGER',

    CONSTRAINT "HotelMember_pkey" PRIMARY KEY ("hotelId","userId")
);

-- CreateIndex
CREATE INDEX "HotelMember_userId_idx" ON "HotelMember"("userId");

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelMember" ADD CONSTRAINT "HotelMember_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelMember" ADD CONSTRAINT "HotelMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
