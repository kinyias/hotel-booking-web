import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ListRoomDto } from './dto/list-room.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/v1/hotels/:hotelId/rooms')
export class RoomController {
  constructor(private readonly service: RoomService) {}

  @Post()
  create(@Param('hotelId') hotelId: string, @Req() req: any, @Body() dto: CreateRoomDto) {
    return this.service.create(hotelId, req.user.id, dto);
  }

  @Get()
  list(@Param('hotelId') hotelId: string, @Req() req: any, @Query() q: ListRoomDto) {
    return this.service.list(hotelId, req.user.id, q);
  }

  @Get(':id')
  get(@Param('hotelId') hotelId: string, @Param('id') id: string, @Req() req: any) {
    return this.service.get(hotelId, req.user.id, id);
  }

  @Patch(':id')
  update(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateRoomDto,
  ) {
    return this.service.update(hotelId, req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Param('hotelId') hotelId: string, @Param('id') id: string, @Req() req: any) {
    return this.service.remove(hotelId, req.user.id, id);
  }
}
