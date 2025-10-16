// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  RegisterDtoType,
  VerifyEmailDto,
  VerifyEmailDtoType,
} from 'src/modules/auth/dto/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDtoType) {
    const { email, password, firstName, lastName } = body;
    return this.authService.register({ email, password, firstName, lastName });
  }

  @Post('verify-email')
  async verify(@Body() body: VerifyEmailDtoType) {
    return this.authService.verifyEmail(body.token);
  }
  // @Post('login')
  // login(@Body() dto: LoginDto) {
  //   return this.authService.login(dto);
  // }
}
