import {
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserAvatarService } from './user-avatar.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { imageMulterOptions } from '../../../common/upload/multer.options';
import { makeImageParsePipe } from '../../../common/upload/image-parse.pipe';

@Controller('users/me/avatar')
@UseGuards(JwtAuthGuard)
export class UserAvatarController {
  constructor(private readonly avatarService: UserAvatarService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', imageMulterOptions))
  async uploadAvatar(
    @UploadedFile(makeImageParsePipe()) file: Express.Multer.File, 
    @Req() req: Request,
  ) {
    const user = req.user as any;
    const image = await this.avatarService.setAvatar(user.id, file);
    return {
      message: 'Avatar uploaded successfully',
      image,
    };
  }

  @Delete()
  async deleteAvatar(@Req() req: Request) {
    const user = req.user as any;
    await this.avatarService.removeAvatar(user.id);
    return { message: 'Avatar deleted successfully' };
  }
}
