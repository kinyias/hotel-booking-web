-- CreateTable
CREATE TABLE "HotelImage" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "kind" "ImageKind" NOT NULL DEFAULT 'GALLERY',
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HotelImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HotelImage_hotelId_kind_idx" ON "HotelImage"("hotelId", "kind");

-- CreateIndex
CREATE INDEX "HotelImage_hotelId_position_idx" ON "HotelImage"("hotelId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "HotelImage_hotelId_imageId_key" ON "HotelImage"("hotelId", "imageId");

-- AddForeignKey
ALTER TABLE "HotelImage" ADD CONSTRAINT "HotelImage_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelImage" ADD CONSTRAINT "HotelImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "ImageAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
