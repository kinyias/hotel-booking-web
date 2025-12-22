import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ActionGuard } from 'src/modules/auth/guards/action.guard';
import { Action } from 'src/modules/auth/decorator/action.decorator';

@Controller()
export class PolicyController {
  constructor(private service: PolicyService) {}

  // ===== Public =====
  @Get('hotels/:hotelId/policies')
  async listPublic(@Param('hotelId') hotelId: string, @Req() req: any) {
    return this.service.listPublic(hotelId);
  }

  // ===== Admin =====
  @UseGuards(JwtAuthGuard, ActionGuard)
  @Get('admin/hotels/:hotelId/policies')
  @Action('policies.read')
  async listAdmin(@Param('hotelId') hotelId: string, @Req() req: any) {
    return this.service.listAdmin(hotelId, req.user.id);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Get('admin/hotels/:hotelId/policies/:id')
  @Action('policies.read')
  async getOne(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.service.getOne(hotelId, req.user.id, id);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Post('admin/hotels/:hotelId/policies')
  @Action('policies.create')
  async create(
    @Param('hotelId') hotelId: string,
    @Body() dto: CreatePolicyDto,
    @Req() req: any,
  ) {
    return this.service.create(hotelId, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Patch('admin/hotels/:hotelId/policies/:id')
  @Action('policies.update')
  async update(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePolicyDto,
    @Req() req: any,
  ) {
    return this.service.update(hotelId, req.user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Delete('admin/hotels/:hotelId/policies/:id')
  @Action('policies.delete')
  async remove(
    @Param('hotelId') hotelId: string,
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.service.remove(hotelId, req.user.id, id);
  }
}
