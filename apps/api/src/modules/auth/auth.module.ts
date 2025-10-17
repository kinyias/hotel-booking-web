import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { JwtAccessStrategy } from '../auth/strategy/jwt-access.strategy';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from '../auth/strategy/google.strategy';

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
