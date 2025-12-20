import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { ListAmenityDto } from './dto/list-amenity.dto';
import { AmenityService } from './amenity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionGuard } from '../auth/guards/action.guard';
import { Action } from '../auth/decorator/action.decorator';

@UseGuards(JwtAuthGuard, ActionGuard)
@Controller('amenities')
export class AmenityController {
  constructor(private readonly service: AmenityService) {}

  @Post()
  @Action('amenities.create')
  create(@Body() dto: CreateAmenityDto) {
    return this.service.create(dto);
  }

  @Get()
  @Action('amenities.list')
  list(@Query() query: ListAmenityDto) {
    return this.service.list(query);
  }

  @Get(':id')
  @Action('amenities.detail.read')
  getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @Patch(':id')
  @Action('amenities.update')
  update(@Param('id') id: string, @Body() dto: UpdateAmenityDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Action('amenities.delete')
  disable(@Param('id') id: string) {
    return this.service.disable(id);
  }
}
