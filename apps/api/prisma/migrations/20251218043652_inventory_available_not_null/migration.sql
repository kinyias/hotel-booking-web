/*
  Warnings:

  - Made the column `totalRooms` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `availableRooms` on table `Inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "totalRooms" SET NOT NULL,
ALTER COLUMN "totalRooms" SET DEFAULT 0,
ALTER COLUMN "availableRooms" SET NOT NULL,
ALTER COLUMN "availableRooms" SET DEFAULT 0;
