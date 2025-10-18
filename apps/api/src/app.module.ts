import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { ActionsModule } from './modules/actions/actions.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ImageService } from 'src/modules/image/image.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    MailModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    ActionsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, ImageService],
})
export class AppModule {}
