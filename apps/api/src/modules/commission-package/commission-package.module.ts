import { Module } from '@nestjs/common';
import { CommissionPackageController } from './commission-package.controller';
import { CommissionPackageService } from './commission-package.service';

@Module({
  controllers: [CommissionPackageController],
  providers: [CommissionPackageService]
})
export class CommissionPackageModule {}
