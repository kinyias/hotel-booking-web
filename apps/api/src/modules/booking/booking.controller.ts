import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('hotels/:hotelId/bookings')
export class BookingController {
  constructor(private readonly service: BookingService) {}

  @Post()
  create(@Param('hotelId') hotelId: string, @Body() dto: CreateBookingDto, @Req() req: any) {
    const userId = req.user?.id ?? null; // tuỳ auth guard bạn đang dùng
    return this.service.create(hotelId, userId, dto);
  }

  @Get()
  list(@Param('hotelId') hotelId: string, @Query() q: any) {
    return this.service.list(hotelId, q);
  }

  @Get(':id')
  findOne(@Param('hotelId') hotelId: string, @Param('id') id: string) {
    return this.service.findOne(hotelId, id);
  }

  @Patch(':id/cancel')
  cancel(@Param('hotelId') hotelId: string, @Param('id') id: string) {
    return this.service.cancel(hotelId, id);
  }
}
