import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { Request } from 'express';
import { ListUsersQuery } from '../users/dto/list-users.query';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from '../users/dto/public-user.dto';
import { UpdateMeDto } from '../users/dto/update-me.dto';

// ✅ add
import { Action } from '../auth/decorator/action.decorator';
import { ActionGuard } from 'src/modules/auth/guards/action.guard';

@Controller('users')
// ✅ gọn: dùng chung cho cả controller
@UseGuards(JwtAuthGuard, ActionGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Action('users.me.changePassword')
  @Post('me/change-password')
  async changePassword(@Req() req: any, @Body() body: ChangePasswordDto) {
    await this.users.changePassword(req.user.id, body);
    return { ok: true };
  }

  @Action('users.me.read')
  @Get('me')
  async me(@Req() req: Request) {
    const user = req.user as any;
    return { data: await this.users.me(user.id) };
  }

  @Action('users.me.update')
  @Patch('me')
  async updateMe(@Req() req: Request, @Body() dto: UpdateMeDto) {
    const user = req.user as any;
    const data = await this.users.updateMe(user.id, dto);
    return plainToInstance(PublicUserDto, data, {
      groups: ['private'],
      excludeExtraneousValues: true,
    });
  }

  @Action('users.profile.read')
  @Get(':id')
  async getById(@Req() req: Request, @Param('id') id: string) {
    const requesterId = (req.user as any).id;
    const data = await this.users.getPublicProfile(requesterId, id);
    const groups = data.email ? ['private'] : [];
    return plainToInstance(PublicUserDto, data, {
      groups,
      excludeExtraneousValues: true,
    });
  }

  @Action('users.list')
  @Get()
  async list(@Query() query: ListUsersQuery) {
    const { items, meta } = await this.users.listUsers(query);
    return {
      data: items.map((u) =>
        plainToInstance(PublicUserDto, u, {
          groups: ['private'],
          excludeExtraneousValues: true,
        }),
      ),
      meta,
    };
  }
}
