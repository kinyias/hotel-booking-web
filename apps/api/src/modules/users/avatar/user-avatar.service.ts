import { Injectable, Inject } from '@nestjs/common';
import { Readable } from 'stream';
import { v2 as Cloudinary } from 'cloudinary';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ImageService } from 'src/modules/image/image.service';

@Injectable()
export class UserAvatarService {
  constructor(
    private prisma: PrismaService,
    @Inject('CLOUDINARY') private readonly cloudinary: typeof Cloudinary,
  ) {}

  async setAvatar(userId: string, file: Express.Multer.File) {
    // Upload lên Cloudinary
    const uploaded = await new Promise<any>((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        { folder: `stayra/avatars/${userId}` },
        (error, result) => (error ? reject(error) : resolve(result)),
      );
      Readable.from(file.buffer).pipe(stream);
    });

    // Xoá avatar cũ nếu có
    const current = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarId: true, avatar: { select: { publicId: true } } },
    });

    if (current?.avatarId && current.avatar?.publicId) {
      await this.cloudinary.uploader
        .destroy(current.avatar.publicId)
        .catch(() => {});
      await this.prisma.imageAsset
        .delete({ where: { id: current.avatarId } })
        .catch(() => {});
    }

    // Lưu ImageAsset
    const image = await this.prisma.imageAsset.create({
      data: {
        publicId: uploaded.public_id,
        url: uploaded.url,
        secureUrl: uploaded.secure_url,
      },
    });

    // Gán vào user
    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarId: image.id },
    });

    return image;
  }

  async removeAvatar(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarId: true, avatar: { select: { publicId: true } } },
    });
    if (!user?.avatarId) return;

    if (user.avatar?.publicId) {
      await this.cloudinary.uploader
        .destroy(user.avatar.publicId)
        .catch(() => {});
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarId: null },
    });

    await this.prisma.imageAsset
      .delete({ where: { id: user.avatarId } })
      .catch(() => {});
  }
}
