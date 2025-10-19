import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserAvatarService } from './avatar/user-avatar.service';
import { UserAvatarController } from './avatar/user-avatar.controller';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { CloudinaryModule } from '../../modules/cloudinary/cloudinary.module';
import { UsersController } from '../../modules/users/users.controller';

@Module({
  imports: [CloudinaryModule],
  controllers: [UserAvatarController, UsersController],
  providers: [UsersService, PrismaService, UserAvatarService],
  exports: [UsersService],
})
export class UsersModule {}
