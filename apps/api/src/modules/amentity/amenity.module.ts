import { Module } from '@nestjs/common';
import { AmenityController } from './amenity.controller';
import { AmenityService } from './amenity.service';

@Module({
  providers: [AmenityService],
  controllers: [AmenityController],
})
export class AmentityModule {}
