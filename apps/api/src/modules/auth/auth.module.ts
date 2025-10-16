// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { MailModule } from 'src/modules/mail/mail.module';
import { UsersService } from 'src/modules/users/users.service';
import { MailService } from 'src/modules/mail/mail.service';
import { JwtAccessStrategy } from 'src/modules/auth/strategy/jwt-access.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/modules/auth/strategy/google.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [
        ConfigModule,
        UsersModule,
        PrismaModule,
        MailModule,
        JwtModule.register({}),
        PassportModule.register({ session: false }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtAccessStrategy,
    GoogleStrategy,
    UsersService,
    MailService,
  ],
})
export class AuthModule {}
