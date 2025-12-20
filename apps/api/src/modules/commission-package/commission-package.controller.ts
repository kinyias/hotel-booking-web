import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Action } from 'src/modules/auth/decorator/action.decorator';
import { ActionGuard } from 'src/modules/auth/guards/action.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CommissionPackageService } from 'src/modules/commission-package/commission-package.service';
import { CreateCommissionPackageDto } from 'src/modules/commission-package/dto/create-commission-package.dto';
import { UpdateCommissionPackageDto } from 'src/modules/commission-package/dto/update-commission-package.dto';

@Controller('/admin/commission-packages')
@UseGuards(JwtAuthGuard, ActionGuard)
export class CommissionPackageController {
  constructor(private readonly service: CommissionPackageService) {}

  @Get()
  @Action('commission-packages.list')
  list() {
    return this.service.list();
  }

  @Get(':id')
  @Action('commission-packages.view')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Action('commission-packages.create')
  create(@Body() dto: CreateCommissionPackageDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Action('commission-packages.update')
  update(@Param('id') id: string, @Body() dto: UpdateCommissionPackageDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/deactivate')
  @Action('commission-packages.deactivate')
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }

  @Patch(':hotelId/commission-package')
  @Action('hotels.set-commission-package')
  async setCommissionPackage(
    @Param('hotelId') hotelId: string,
    @Body() body: { commissionPackageId: string },
  ) {
    return this.service.setCommissionPackage(hotelId, body.commissionPackageId);
  }
}
