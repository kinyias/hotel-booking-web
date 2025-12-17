import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { ListAmenityDto } from './dto/list-amenity.dto';
import { AmenityService } from 'src/modules/amentity/amenity.service';

@Controller('amenities')
export class AmenityController {
  constructor(private readonly service: AmenityService) {}

  @Post()
  create(@Body() dto: CreateAmenityDto) {
    return this.service.create(dto);
  }

  @Get()
  list(@Query() query: ListAmenityDto) {
    return this.service.list(query);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAmenityDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  disable(@Param('id') id: string) {
    return this.service.disable(id);
  }
}
