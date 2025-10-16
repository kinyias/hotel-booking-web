import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from 'src/modules/auth/dto/change-password.dto';

@Controller('v1/users/me')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Post('change-password')
  async changePassword(
    @Req() req: any,
    @Body()
    body: ChangePasswordDto,
  ) {
    await this.users.changePassword(req.user.id, body);
    return { ok: true };
  }
}
