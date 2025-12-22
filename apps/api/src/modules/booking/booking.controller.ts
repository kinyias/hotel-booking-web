import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListMyBookingDto } from './dto/list-my-bookings.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { Action } from '../auth/decorator/action.decorator';
import { CheckInDto } from 'src/modules/booking/dto/check-in.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class BookingController {
  constructor(private readonly service: BookingService) {}

  @Get('bookings/me')
  getMyBookings(@Req() req: any, @Query() q: ListMyBookingDto) {
    const userId = req.user?.id;
    return this.service.getMyBookings(userId, q);
  }

  @Get('bookings/me/:id')
  getMyBooking(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    return this.service.getMyBookingDetail(userId, id);
  }

  @Post('hotels/:hotelId/bookings')
  create(
    @Param('hotelId') hotelId: string,
    @Body() dto: CreateBookingDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    this.service.create(hotelId, userId, dto);
  }

  @Get('hotels/:hotelId/bookings')
  @Action('bookings.list')
  list(@Param('hotelId') hotelId: string, @Query() q: any) {
    return this.service.list(hotelId, q);
  }

  @Get('hotels/:hotelId/bookings/:id')
  @Action('bookings.detail.read')
  findOne(@Param('hotelId') hotelId: string, @Param('id') id: string) {
    return this.service.findOne(hotelId, id);
  }

  @Patch('hotels/:hotelId/bookings/:id/cancel')
  @Action('bookings.cancel')
  cancel(@Param('hotelId') hotelId: string, @Param('id') id: string) {
    return this.service.cancel(hotelId, id);
  }

  @Patch('hotels/:hotelId/bookings/:id/status')
  @Action('bookings.status.update')
  updateStatus(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.service.updateStatus(hotelId, userId, id, dto);
  }

  @Post('bookings/:id/check-in')
  @Action('bookings.checkin') // bạn seed ApiAction key này
  async checkIn(@Param('id') bookingId: string, @Body() dto: CheckInDto, @Req() req: any) {
    return this.service.checkIn(bookingId, req.user.id, dto);
  }

  @Get('bookings/:id/check-in')
  @Action('bookings.checkin.read')
  async getCheckIn(@Param('id') bookingId: string, @Req() req: any) {
    return this.service.getCheckIn(bookingId, req.user.id);
  }
}
