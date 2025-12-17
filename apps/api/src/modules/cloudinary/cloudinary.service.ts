import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  v2 as Cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: typeof Cloudinary,
    private readonly prisma: PrismaService,
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

  async deleteFile(publicId: string) {
    return this.cloudinary.uploader.destroy(publicId);
  }

  async getFolders() {
    try {
      const result = await this.cloudinary.api.root_folders();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getImagesInFolder(folderName: string) {
    try {
      const result = await this.cloudinary.search
        .expression(`folder:${folderName}`)
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async createFolder(folderName: string, userId: string) {
    try {
      await this.cloudinary.api.create_folder(folderName);
      return this.prisma.folderGallery.create({
        data: {
          folderName,
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async uploadImagesToFolder(
    files: Array<Express.Multer.File>,
    folderName: string,
    userId: string,
  ) {
    // Ensure folder exists in DB
    let folder = await this.prisma.folderGallery.findUnique({
      where: { folderName },
    });

    if (!folder) {
      // If folder doesn't exist in DB, create it
      // Cloudinary will create folder automatically on upload if it doesn't exist
      folder = await this.prisma.folderGallery.create({
        data: {
          folderName,
          userId,
        },
      });
    }

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          { folder: folderName },
          async (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Upload failed'));

            try {
              const image = await this.prisma.imageGallery.create({
                data: {
                  publicId: result.public_id,
                  url: result.url,
                  secureUrl: result.secure_url,
                  userId,
                  folderId: folder!.id,
                },
              });
              resolve(image);
            } catch (dbError) {
              reject(dbError);
            }
          },
        );
        Readable.from(file.buffer).pipe(uploadStream);
      });
    });

    return Promise.all(uploadPromises);
  }

  async getFolderGalleries(userId: string) {
  return this.prisma.folderGallery.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          galleries: {
            where: { userId }, // only count images of this user
          },
        },
      },
    },
  });
}


  async getImageGalleries(userId: string, folderId: string) {
    return this.prisma.imageGallery.findMany({
      where: { userId, folderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
