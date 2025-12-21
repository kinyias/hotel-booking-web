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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignRolesToUserDto } from './dto/assign-roles-to-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { Action } from '../auth/decorator/action.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.service.create(dto);
  }

  @Get()
  @Action('roles.list')
  findAll(
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.service.findAll({
      search,
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/permissions')
  setRolePermissions(
    @Param('id') roleId: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.service.setRolePermissions(roleId, dto);
  }

  @Post('/assign-to-user')
  setUserRoles(@Body() dto: AssignRolesToUserDto) {
    return this.service.setUserRoles(dto);
  }
}
