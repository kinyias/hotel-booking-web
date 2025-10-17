import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from '../users/users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
