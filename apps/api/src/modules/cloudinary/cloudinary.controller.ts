import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }

  @Get('folders')
  async getFolders() {
    return this.cloudinaryService.getFolders();
  }

  @Get('folders/:folderName')
  async getImagesInFolder(@Param('folderName') folderName: string) {
    return this.cloudinaryService.getImagesInFolder(folderName);
  }

  @Post('create-folder')
  @UseGuards(JwtAuthGuard)
  async createFolder(@Body('folderName') folderName: string, @Req() req: any) {
    if (!folderName) throw new BadRequestException('Folder name is required');
    return this.cloudinaryService.createFolder(folderName, req.user.id);
  }

  @Post('image/:folderName')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImagesToFolder(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('folderName') folderName: string,
    @Req() req: any,
  ) {
    if (!files || files.length === 0)
      throw new BadRequestException('Files are required');
    return this.cloudinaryService.uploadImagesToFolder(
      files,
      folderName,
      req.user.id,
    );
  }

  @Get('db-folders')
  @UseGuards(JwtAuthGuard)
  async getFolderGalleries(@Req() req: any) {
    return this.cloudinaryService.getFolderGalleries(req.user.id);
  }

  @Get('db-folders/:folderId/images')
  @UseGuards(JwtAuthGuard)
  async getImageGalleries(
    @Param('folderId') folderId: string,
    @Req() req: any,
  ) {
    return this.cloudinaryService.getImageGalleries(req.user.id, folderId);
  }
}
