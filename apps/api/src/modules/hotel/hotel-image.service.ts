import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ImageKind, Prisma } from '@prisma/client';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class HotelImageService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async listHotelImages(hotelId: string) {
    const hotel = await this.prisma.hotel.findFirst({
      where: { id: hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    return this.prisma.hotelImage.findMany({
      where: { hotelId },
      orderBy: [{ kind: 'asc' }, { position: 'asc' }],
      include: { image: true },
    });
  }

  async uploadHotelImages(params: {
    hotelId: string;
    files: Express.Multer.File[];
    kind?: ImageKind;
  }) {
    const { hotelId, files } = params;
    const kind = params.kind ?? 'GALLERY';

    if (!files?.length) throw new BadRequestException('No files uploaded');

    const hotel = await this.prisma.hotel.findFirst({
      where: { id: hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    // position start: max + 1 theo kind
    const last = await this.prisma.hotelImage.findFirst({
      where: { hotelId, kind },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    let nextPos = (last?.position ?? -1) + 1;

    const results: any[] = [];

    for (const file of files) {
      const uploaded = await this.cloudinary.uploadFile(file);

      // bạn đang return UploadApiResponse | UploadApiErrorResponse
      // nên check minimal fields
      const publicId = (uploaded as any).public_id;
      const url = (uploaded as any).url;
      const secureUrl = (uploaded as any).secure_url;

      if (!publicId || !secureUrl) {
        throw new BadRequestException('Upload to cloudinary failed');
      }

      const created = await this.prisma.$transaction(async (tx) => {
        const image = await tx.imageAsset.create({
          data: {
            publicId,
            url: url ?? secureUrl,
            secureUrl,
          },
        });

        // Nếu kind=COVER: cho phép nhiều cover hay chỉ 1?
        // => mình enforce "1 cover": xoá cover cũ (DB link) trước khi tạo link mới.
        if (kind === 'COVER') {
          await tx.hotelImage.deleteMany({ where: { hotelId, kind: 'COVER' } });
          nextPos = 0;
        }

        return tx.hotelImage.create({
          data: {
            hotelId,
            imageId: image.id,
            kind,
            position: nextPos++,
          },
          include: { image: true },
        });
      });

      results.push(created);
    }

    return results;
  }

  async reorderHotelImages(
    hotelId: string,
    items: Array<{ hotelImageId: string; position: number }>,
  ) {
    const hotel = await this.prisma.hotel.findFirst({
      where: { id: hotelId, deletedAt: null },
      select: { id: true },
    });
    if (!hotel) throw new NotFoundException('Hotel not found');

    // update batch
    await this.prisma.$transaction(
      items.map((it) =>
        this.prisma.hotelImage.updateMany({
          where: { id: it.hotelImageId, hotelId },
          data: { position: it.position },
        }),
      ),
    );

    return this.listHotelImages(hotelId);
  }

  async deleteHotelImage(hotelId: string, hotelImageId: string) {
    const record = await this.prisma.hotelImage.findFirst({
      where: { id: hotelImageId, hotelId },
      include: { image: true },
    });
    if (!record) throw new NotFoundException('Hotel image not found');

    // xoá link + image asset
    // NOTE: nếu ImageAsset có thể được dùng nơi khác, thì không nên xoá ImageAsset.
    // Với thiết kế hiện tại (ảnh hotel tạo riêng), xoá luôn ImageAsset là hợp lý.
    await this.prisma.$transaction(async (tx) => {
      await tx.hotelImage.delete({ where: { id: record.id } });
      await tx.imageAsset.delete({ where: { id: record.imageId } });
    });

    // xoá cloudinary
    await this.cloudinary.deleteFile(record.image.publicId);

    return { deleted: true };
  }
}
