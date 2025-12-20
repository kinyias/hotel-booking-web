import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoomTypeService } from './room-type.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { AvailableRoomTypeDto, ListRoomTypeDto } from './dto/list-room-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { Action } from '../auth/decorator/action.decorator';

@UseGuards(JwtAuthGuard)
@Controller()
export class RoomTypeController {
  constructor(private readonly service: RoomTypeService) {}

  @Public()
  @Get('room-types')
  async listAll(@Query() query: ListRoomTypeDto) {
    return this.service.listAll(query);
  }

  @Post('hotels/:hotelId/room-types')
  async create(
    @Param('hotelId') hotelId: string,
    @Body() dto: CreateRoomTypeDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.service.create(hotelId, userId, dto);
  }
  
  @Get('hotels/:hotelId/room-types')
  async list(
    @Param('hotelId') hotelId: string,
    @Query() query: ListRoomTypeDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.service.list(hotelId, userId, query);
  }

  @Public()
  @Get('hotels/:hotelId/room-types/available')
  async available(
    @Param('hotelId') hotelId: string,
    @Query() query: AvailableRoomTypeDto,
    @Req() req: any,
  ) {
    return this.service.getAvailableRoomTypes(hotelId, query);
  }

  @Get('hotels/:hotelId/room-types/:id')
  async getOne(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.service.getOne(hotelId, userId, id);
  }

  @Patch('hotels/:hotelId/room-types/:id')
  @Action('room-types.update')
  async update(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRoomTypeDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.service.update(hotelId, userId, id, dto);
  }

  @Delete('hotels/:hotelId/room-types/:id')
  @Action('room-types.delete')
  async remove(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.service.remove(hotelId, userId, id);
  }
}
