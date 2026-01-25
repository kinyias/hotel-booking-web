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
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ListReviewsDto } from './dto/list-reviews.dto';
import { ModerateReviewDto, UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Action } from '../auth/decorator/action.decorator';
import { ReviewService } from './reviews.service';
import { ActionGuard } from '../auth/guards/action.guard';

@Controller()
export class ReviewController {
  constructor(private service: ReviewService) {}

  // Public: xem review của hotel
  @Get('hotels/:hotelId/reviews')
  async listPublic(
    @Param('hotelId') hotelId: string,
    @Query() q: ListReviewsDto,
  ) {
    return this.service.listPublic(hotelId, q);
  }

  // Hotel moderation: xem tất cả review của hotel (bao gồm bị ẩn)
  @Get('hotels/:hotelId/reviews/moderation')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @Action('reviews.moderate')
  async listForModeration(
    @Param('hotelId') hotelId: string,
    @Query() q: ListReviewsDto,
    @Req() req: any,
  ) {
    return this.service.listForModeration(hotelId, req.user.id, q);
  }

  // User: tạo review (phải login)
  @Post('hotels/:hotelId/reviews')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('hotelId') hotelId: string,
    @Body() dto: CreateReviewDto,
    @Req() req: any,
  ) {
    return this.service.create(hotelId, req.user.id, dto);
  }

  // User: xem review của mình
  @Get('users/me/reviews')
  @UseGuards(JwtAuthGuard)
  async myReviews(@Query() q: ListReviewsDto, @Req() req: any) {
    return this.service.listMy(req.user.id, q);
  }

  // User: sửa review của chính mình (tuỳ bạn có muốn)
  @Patch('reviews/:id')
  @UseGuards(JwtAuthGuard)
  async updateMy(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @Req() req: any,
  ) {
    return this.service.updateMy(id, req.user.id, dto);
  }

  // Hotel moderation: ẩn/hiện review
  @Patch('hotels/:hotelId/reviews/:id/moderate')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @Action('reviews.moderate')
  async moderate(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Body() dto: ModerateReviewDto,
    @Req() req: any,
  ) {
    return this.service.moderate(hotelId, req.user.id, id, dto);
  }

  // Hotel moderation: soft delete review
  @Delete('hotels/:hotelId/reviews/:id')
  @UseGuards(JwtAuthGuard, ActionGuard)
  @Action('reviews.delete')
  async remove(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.service.remove(hotelId, req.user.id, id);
  }
}
