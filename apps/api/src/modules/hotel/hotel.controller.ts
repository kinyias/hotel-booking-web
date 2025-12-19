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
import { Public } from 'src/common/decorators/public.decorator';
import { Action } from 'src/modules/auth/decorator/action.decorator';
import { ActionGuard } from 'src/modules/auth/guards/action.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AddMemberDto } from 'src/modules/hotel/dto/add-member.dto';
import { CreateHotelDto } from 'src/modules/hotel/dto/create-hotel.dto';
import { ListHotelsQueryDto } from 'src/modules/hotel/dto/list-hotels.query';
import { UpdateHotelDto } from 'src/modules/hotel/dto/update-hotel.dto';
import { HotelMemberGuard } from 'src/modules/hotel/guards/hotel-member.guard';
import { HotelService } from 'src/modules/hotel/hotel.service';

@UseGuards(JwtAuthGuard, ActionGuard)
@Controller('hotels')
export class HotelController {
  constructor(private hotelService: HotelService) {}
  @Public()
  @Get('/public')
  listPublicHotels(@Query() query: ListHotelsQueryDto) {
    return this.hotelService.listPublicHotels(query);
  }

  @Post()
  @Action('hotels.create')
  create(@Req() req: any, @Body() dto: CreateHotelDto) {
    return this.hotelService.createHotel(req.user.id, dto);
  }

  @Get('/me')
  @Action('hotels.my.list') 
  myHotels(@Req() req: any) {
    return this.hotelService.getMyHotels(req.user.id);
  }

  @Patch('/:hotelId')
  @UseGuards(HotelMemberGuard)
  @Action('hotels.update')
  update(@Param('hotelId') hotelId: string, @Body() dto: UpdateHotelDto) {
    return this.hotelService.updateHotel(hotelId, dto);
  }

  @Post('/:hotelId/members')
  @UseGuards(HotelMemberGuard)
  @Action('hotels.members.add')
  addMember(@Param('hotelId') hotelId: string, @Body() dto: AddMemberDto) {
    return this.hotelService.addMember(hotelId, dto);
  }

  @Delete('/:hotelId/members/:userId')
  @UseGuards(HotelMemberGuard)
  @Action('hotels.members.remove')
  removeMember(
    @Param('hotelId') hotelId: string,
    @Param('userId') userId: string,
  ) {
    return this.hotelService.removeMember(hotelId, userId);
  }
  @Public()
  @Get('/:hotelId')
  // @Action('hotels.detail.read')
  getDetail(@Param('hotelId') hotelId: string) {
    return this.hotelService.getHotelDetail(hotelId);
  }

  // ✅ members list
  @Get('/:hotelId/members')
  @UseGuards(HotelMemberGuard)
  @Action('hotels.members.list')
  listMembers(@Param('hotelId') hotelId: string) {
    return this.hotelService.listMembers(hotelId);
  }


  // ✅ soft delete hotel
  @Delete('/:hotelId')
  @UseGuards(HotelMemberGuard)
  @Action('hotels.delete')
  deleteHotel(@Req() req: any, @Param('hotelId') hotelId: string) {
    return this.hotelService.softDeleteHotel(hotelId, req.user.id);
  }
  
  @Public()
  @Get()
  @Action('hotels.admin.list')
  listHotelsAdmin(@Query() query: ListHotelsQueryDto) {
    return this.hotelService.listHotelsAdmin(query);
  }
}
