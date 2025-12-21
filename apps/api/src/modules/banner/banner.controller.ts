// banner/banner.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Action } from '../auth/decorator/action.decorator';
import { ActionGuard } from '../auth/guards/action.guard';

@Controller()
export class BannerController {
  constructor(private service: BannerService) {}

  // ===== Public =====
  @Get('banners')
  async listPublic() {
    return this.service.listPublic();
  }

  // ===== Admin =====
  @UseGuards(JwtAuthGuard, ActionGuard)
  @Post('admin/banners')
  @Action('banners.create')
  create(@Body() dto: CreateBannerDto, @Req() req: any) {
    return this.service.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Get('admin/banners')
  @Action('banners.read')
  listAdmin() {
    return this.service.listAdmin();
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Patch('admin/banners/:id')
  @Action('banners.update')
  update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Delete('admin/banners/:id')
  @Action('banners.delete')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
