import { ImageKind } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UploadHotelImagesDto {
  @IsOptional()
  @IsEnum(ImageKind)
  kind?: ImageKind; // default GALLERY
}
