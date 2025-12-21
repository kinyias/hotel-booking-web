import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { MANAGE_USER } from '../permissions/permissions.constant';
import { Action } from '../auth/decorator/action.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.service.create(dto);
  }

  @Get()
  @Action('permissions.list')
  findAll(q?: { search?: string; skip?: number; take?: number }) {
  return this.service.listPermissions({
    q: q?.search,
    offset: q?.skip ?? 0,
    limit: q?.take ?? 50,
  });
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
