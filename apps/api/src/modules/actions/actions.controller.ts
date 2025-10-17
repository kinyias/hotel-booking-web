import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { UpsertActionDto } from './dto/upsert-action.dto';
import { SetActionPermissionsDto } from './dto/set-action-permissions.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { PermissionsGuard } from 'src/modules/auth/guards/permissions.guard';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { Permissions } from 'src/modules/auth/decorator/permissions.decorator';

@Controller('actions')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles('ADMIN')
@Permissions('MANAGE_USER') // hoặc MANAGE_POLICY tùy bạn đặt
export class ActionsController {
  constructor(private readonly service: ActionsService) {}

  @Post('upsert')
  upsert(@Body() dto: UpsertActionDto) {
    return this.service.upsert(dto);
  }

  @Get()
  list() {
    return this.service.findAll();
  }

  @Get(':key')
  get(@Param('key') key: string) {
    return this.service.findOneByKey(key);
  }

  @Patch(':key/permissions')
  setPerms(@Param('key') key: string, @Body() dto: SetActionPermissionsDto) {
    return this.service.setActionPermissions(key, dto.permissionNames);
  }
}
