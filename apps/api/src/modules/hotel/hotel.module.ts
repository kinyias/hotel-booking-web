import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { HotelImageService } from 'src/modules/hotel/hotel-image.service';
import { HotelImageController } from 'src/modules/hotel/hotel-image.controller';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  providers: [HotelService, HotelImageService],
  controllers: [HotelController, HotelImageController],
})
export class HotelModule {}
