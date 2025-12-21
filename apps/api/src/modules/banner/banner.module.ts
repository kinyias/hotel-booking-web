import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';

@Module({
  providers: [BannerService],
  controllers: [BannerController]
})
export class BannerModule {}
