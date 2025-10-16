// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from 'src/modules/auth/dto/verify-email.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { LogoutDto } from 'src/modules/auth/dto/logout.dto';
import { RefreshDto } from 'src/modules/auth/dto/refresh.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { ForgotPasswordDto } from 'src/modules/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from 'src/modules/auth/dto/reset-password.dto';
import { minutes, Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    const { email, password, firstName, lastName } = body;
    return this.authService.register({ email, password, firstName, lastName });
  }

  @Post('verify-email')
  async verify(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmail(body.token);
  }
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Req() req: any, @Ip() ip: string) {
    const user = await this.authService.validateUserByEmailPassword(
      dto.email,
      dto.password,
    );
    const { accessToken, refreshToken, jti } =
      await this.authService.issueTokens(
        user.id,
        req.headers['user-agent'],
        ip,
      );
    return { accessToken, refreshToken, jti, tokenType: 'Bearer' };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() dto: RefreshDto, @Req() req: any, @Ip() ip: string) {
    const { accessToken, refreshToken, jti } =
      await this.authService.rotateRefreshToken(
        dto.refreshToken,
        req.headers['user-agent'],
        ip,
      );
    return { accessToken, refreshToken, jti, tokenType: 'Bearer' };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  async logout(@Body() dto: LogoutDto, @Req() req: any) {
    const jti = dto.jti ?? req.user?.jti;
    if (jti)
      await this.authService.revokeSessionByJti(
        jti,
        req.user?.id,
        'user logout',
      );
    return;
  }

  @Throttle({ default: { limit: 5, ttl: minutes(10) } })
  @Post('forgot-password')
  @HttpCode(202)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.authService.forgotPassword(body.email);
    return { ok: true };
  }

  @Post('reset-password')
  async resetPassword(
    @Body()
    body: ResetPasswordDto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    await this.authService.resetPassword(body.token, body.newPassword, ip, ua);
    return { ok: true };
  }
}
