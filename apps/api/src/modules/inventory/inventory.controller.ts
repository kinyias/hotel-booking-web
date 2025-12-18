import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Delete,
  Query,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ListInventoryDto } from './dto/list-inventory.dto';
import { BulkSetInventoryDto } from './dto/bulk-set-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { InventoryService } from 'src/modules/inventory/inventory.service';

const getUserId = (req: any) => req.user?.id;
@UseGuards(JwtAuthGuard)
@Controller('hotels/:hotelId/inventories')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get()
  list(
    @Param('hotelId') hotelId: string,
    @Query() q: ListInventoryDto,
    @Req() req: any,
  ) {
    return this.service.list(hotelId, getUserId(req), q);
  }

  @Post('bulk')
  bulkSet(
    @Param('hotelId') hotelId: string,
    @Body() dto: BulkSetInventoryDto,
    @Req() req: any,
  ) {
    return this.service.bulkSet(hotelId, getUserId(req), dto);
  }


  @Patch(':id')
  updateOne(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Body() dto: UpdateInventoryDto,
    @Req() req: any,
  ) {
    return this.service.updateOne(hotelId, getUserId(req), id, dto);
  }

  @Delete(':id')
  remove(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.service.softDelete(hotelId, getUserId(req), id);
  }
}
