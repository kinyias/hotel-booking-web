/*
  Warnings:

  - A unique constraint covering the columns `[roomTypeId,hotelId,date]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Inventory_roomTypeId_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_roomTypeId_hotelId_date_key" ON "Inventory"("roomTypeId", "hotelId", "date");
