import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserAvatarService } from './avatar/user-avatar.service';
import { UserAvatarController } from './avatar/user-avatar.controller';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CloudinaryModule } from 'src/modules/cloudinary/cloudinary.module';
import { UsersController } from 'src/modules/users/users.controller';

@Module({
  imports: [CloudinaryModule],
  controllers: [UserAvatarController, UsersController],
  providers: [UsersService, PrismaService, UserAvatarService],
  exports: [UsersService],
})
export class UsersModule {}
