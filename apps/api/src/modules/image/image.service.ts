import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';

// image.service.ts
@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  async createFromCloudinaryResp(resp: any, uploadedById?: string) {
    return this.prisma.imageAsset.create({
      data: {
        publicId: resp.public_id,
        url: resp.url,
        secureUrl: resp.secure_url,
      },
    });
  }
}
