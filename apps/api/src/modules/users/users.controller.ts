import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { Request } from 'express';

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

  @Get('me')
  async me(@Req() req: Request) {
    const user = req.user as any;
    return await this.users.me(user.id);
  }
}
