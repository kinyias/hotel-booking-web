import { PartialType } from '@nestjs/mapped-types';
import { CreateCommissionPackageDto } from './create-commission-package.dto';

export class UpdateCommissionPackageDto extends PartialType(
  CreateCommissionPackageDto,
) {}
