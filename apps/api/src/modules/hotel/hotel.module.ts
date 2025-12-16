import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';

@Module({
  providers: [HotelService],
  controllers: [HotelController]
})
export class HotelModule {}
