import {
  Body,
  Controller,
  HttpCode,
  Ip,
  Post,
  Req,
  UseGuards,
  Headers,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from '../auth/dto/verify-email.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { LogoutDto } from '../auth/dto/logout.dto';
import { RefreshDto } from '../auth/dto/refresh.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { ForgotPasswordDto } from '../auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '../auth/dto/reset-password.dto';
import { minutes, Throttle } from '@nestjs/throttler';
import type { Response, Request } from 'express';
import { AuthProvider } from '@prisma/client';
import { ResendEmailDto } from 'src/modules/auth/dto/resend-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('verify-email')
  async verify(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmail(body.token);
  }
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Req() req: any,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: any,
  ) {
    const user = await this.authService.validateUserByEmailPassword(
      dto.email,
      dto.password,
    );
    const { accessToken, refreshToken, jti } =
      await this.authService.issueTokens(user.id, {
        ua: req.headers['user-agent'],
        ip,
        provider: AuthProvider.LOCAL,
      });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return { accessToken, jti, tokenType: 'Bearer' };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: any,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const old = req.cookies?.['refresh_token'];
    console.log(old);
    const { accessToken, refreshToken, jti } =
      await this.authService.rotateRefreshToken(
        old,
        req.headers['user-agent'],
        ip,
      );
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return { accessToken, jti, tokenType: 'Bearer' };
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  async logout(
    @Body() dto: LogoutDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jti = dto.jti ?? req.user?.jti;
    if (jti) {
      await this.authService.revokeSessionByJti(
        jti,
        req.user?.sub,
        'user logout',
      );
    }
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return;
  }

  @Post('logout-all')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  async logoutAll(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    await this.authService.revokeAllUserSessions(
      req.user.sub,
      'User logout all',
    );

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.loginWithGoogle(req.user as any, {
        ip: req.ip,
        userAgent: req.headers['user-agent'] ?? '',
      });

    const web = process.env.PUBLIC_WEB_URL!;

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 ngày
    });
    return res.redirect(
      `${web}/auth/callback#access_token=${encodeURIComponent(accessToken)}`,
    );
  }

  @Get('sessions')
  @UseGuards(AuthGuard('jwt'))
  async mySessions(@Req() req: any) {
    const userId = req.user.id;
    const sessions = await this.authService.getSessions(userId);
    return { items: sessions };
  }

  @Throttle({ default: { limit: 5, ttl: minutes(10) } })
  @Post('resend')
  @HttpCode(HttpStatus.OK)
  async resend(@Body() dto: ResendEmailDto) {
    await this.authService.resendVerificationEmail(dto.email);
    return {
      message:
        'If this email exists and is not verified, a link has been sent.',
    };
  }
}
