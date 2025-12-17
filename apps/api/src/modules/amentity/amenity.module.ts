import { Module } from '@nestjs/common';
import { AmenityController } from 'src/modules/amentity/amenity.controller';
import { AmenityService } from 'src/modules/amentity/amenity.service';

@Module({
  providers: [AmenityService],
  controllers: [AmenityController],
})
export class AmentityModule {}
