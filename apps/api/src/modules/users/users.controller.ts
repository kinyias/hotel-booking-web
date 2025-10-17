import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from 'src/modules/auth/dto/change-password.dto';
import { Action } from 'src/modules/auth/decorator/action.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Post('me/change-password')
  async changePassword(
    @Req() req: any,
    @Body()
    body: ChangePasswordDto,
  ) {
    await this.users.changePassword(req.user.id, body);
    return { ok: true };
  }

  @Get()
  async listUser() {
    return await this.users.listUser();
  }
}
