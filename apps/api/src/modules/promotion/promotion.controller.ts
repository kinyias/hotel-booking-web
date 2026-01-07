
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
import { Public } from '../../common/decorators/public.decorator';
import { Action } from '../auth/decorator/action.decorator';
import { ActionGuard } from '../auth/guards/action.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { ListPromotionsQueryDto } from './dto/list-promotions.query';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionService } from './promotion.service';

@Controller('promotions')
@UseGuards(JwtAuthGuard, ActionGuard)
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @Action('promotions.create')
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.create(createPromotionDto);
  }

  @Get()
  @Action('promotions.list')
  findAll(@Query() query: ListPromotionsQueryDto) {
    return this.promotionService.listAdmin(query);
  }

  @Public()
  @Get('/public')
  findAllPublic(@Query() query: ListPromotionsQueryDto) {
    return this.promotionService.listPublic(query);
  }

  @Get(':id')
  @Action('promotions.read')
  findOne(@Param('id') id: string) {
    return this.promotionService.findOne(id);
  }

  @Patch(':id')
  @Action('promotions.update')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionService.update(id, req.user.id, updatePromotionDto);
  }

  @Delete(':id')
  @Action('promotions.delete')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.promotionService.remove(id, req.user.id);
  }
}
