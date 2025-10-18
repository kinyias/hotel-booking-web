import { Injectable, Inject } from '@nestjs/common';
import {
  v2 as Cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        { folder: 'stayra' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as any);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  
}
