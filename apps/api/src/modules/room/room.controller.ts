import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ListRoomDto } from './dto/list-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';
import { Action } from '../auth/decorator/action.decorator';

@UseGuards(JwtAuthGuard, ActionGuard)
@Controller('hotels/:hotelId/rooms')
export class RoomController {
  constructor(private readonly service: RoomService) {}

  @Post()
  @Action('rooms.create')
  create(@Param('hotelId') hotelId: string, @Req() req: any, @Body() dto: CreateRoomDto) {
    return this.service.create(hotelId, req.user.id, dto);
  }

  @Get()
  @Action('rooms.list')
  list(@Param('hotelId') hotelId: string, @Req() req: any, @Query() q: ListRoomDto) {
    return this.service.list(hotelId, req.user.id, q);
  }

  @Get(':id')
  @Action('rooms.detail.read')
  get(@Param('hotelId') hotelId: string, @Param('id') id: string, @Req() req: any) {
    return this.service.get(hotelId, req.user.id, id);
  }

  @Patch(':id')
  @Action('rooms.update')
  update(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateRoomDto,
  ) {
    return this.service.update(hotelId, req.user.id, id, dto);
  }

  @Delete(':id')
  @Action('rooms.delete')
  remove(@Param('hotelId') hotelId: string, @Param('id') id: string, @Req() req: any) {
    return this.service.remove(hotelId, req.user.id, id);
  }
}
