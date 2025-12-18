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
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AddMemberDto } from 'src/modules/hotel/dto/add-member.dto';
import { CreateHotelDto } from 'src/modules/hotel/dto/create-hotel.dto';
import { ListHotelsQueryDto } from 'src/modules/hotel/dto/list-hotels.query';
import { UpdateHotelDto } from 'src/modules/hotel/dto/update-hotel.dto';
import { HotelMemberGuard } from 'src/modules/hotel/guards/hotel-member.guard';
import { HotelService } from 'src/modules/hotel/hotel.service';

@UseGuards(JwtAuthGuard)
@Controller('hotels')
export class HotelController {
  constructor(private hotelService: HotelService) {}
  @Public()
  @Get('/public')
  listPublicHotels(@Query() query: ListHotelsQueryDto) {
    return this.hotelService.listPublicHotels(query);
  }
  @Post()
  create(@Req() req: any, @Body() dto: CreateHotelDto) {
    return this.hotelService.createHotel(req.user.id, dto);
  }

  @Get('/me')
  myHotels(@Req() req: any) {
    return this.hotelService.getMyHotels(req.user.id);
  }

  @Patch('/:hotelId')
  @UseGuards(HotelMemberGuard)
  update(@Param('hotelId') hotelId: string, @Body() dto: UpdateHotelDto) {
    return this.hotelService.updateHotel(hotelId, dto);
  }

  @Post('/:hotelId/members')
  @UseGuards(HotelMemberGuard)
  addMember(@Param('hotelId') hotelId: string, @Body() dto: AddMemberDto) {
    return this.hotelService.addMember(hotelId, dto);
  }

  @Delete('/:hotelId/members/:userId')
  @UseGuards(HotelMemberGuard)
  removeMember(
    @Param('hotelId') hotelId: string,
    @Param('userId') userId: string,
  ) {
    return this.hotelService.removeMember(hotelId, userId);
  }
  @Public()
  @Get('/:hotelId')
  // @UseGuards(HotelMemberGuard) // chỉ member mới xem detail
  getDetail(@Param('hotelId') hotelId: string) {
    return this.hotelService.getHotelDetail(hotelId);
  }

  // ✅ members list
  @Get('/:hotelId/members')
  @UseGuards(HotelMemberGuard)
  listMembers(@Param('hotelId') hotelId: string) {
    return this.hotelService.listMembers(hotelId);
  }


  // ✅ soft delete hotel
  @Delete('/:hotelId')
  @UseGuards(HotelMemberGuard)
  deleteHotel(@Req() req: any, @Param('hotelId') hotelId: string) {
    return this.hotelService.softDeleteHotel(hotelId, req.user.id);
  }

  @Get()
  listHotelsAdmin(@Query() query: ListHotelsQueryDto) {
    return this.hotelService.listHotelsAdmin(query);
  }
}
