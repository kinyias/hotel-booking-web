import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadHotelImagesDto } from './dto/upload-hotel-images.dto';
import { ReorderHotelImagesDto } from './dto/reorder-hotel-images.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HotelImageService } from 'src/modules/hotel/hotel-image.service';

@Controller('/hotel-images')
@UseGuards(JwtAuthGuard)
export class HotelImageController {
  constructor(private readonly hotelImageService: HotelImageService) {}

  // ✅ list images (member xem được)
  @Get('/:hotelId/images')
  list(@Param('hotelId') hotelId: string) {
    return this.hotelImageService.listHotelImages(hotelId);
  }

  // ✅ upload slider/cover (OWNER/MANAGER)
  @Post('/:hotelId/images')
  @UseInterceptors(FilesInterceptor('files', 10)) // tối đa 10 files/lần
  upload(
    @Param('hotelId') hotelId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Query() query: UploadHotelImagesDto,
  ) {
    return this.hotelImageService.uploadHotelImages({
      hotelId,
      files,
      kind: query.kind, // COVER | GALLERY
    });
  }

  // ✅ reorder (OWNER/MANAGER)
  @Patch('/:hotelId/images/reorder')
  reorder(
    @Param('hotelId') hotelId: string,
    @Body() dto: ReorderHotelImagesDto,
  ) {
    return this.hotelImageService.reorderHotelImages(hotelId, dto.items);
  }

  // ✅ delete image (OWNER/MANAGER)
  @Delete('/:hotelId/images/:hotelImageId')
  remove(
    @Param('hotelId') hotelId: string,
    @Param('hotelImageId') hotelImageId: string,
  ) {
    return this.hotelImageService.deleteHotelImage(hotelId, hotelImageId);
  }
}
