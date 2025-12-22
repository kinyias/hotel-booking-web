import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ListContactDto } from './dto/list-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Action } from '../auth/decorator/action.decorator';
import { ActionGuard } from '../auth/guards/action.guard';

@Controller()
export class ContactController {
  constructor(private readonly service: ContactService) {}

  // ===== Public =====
  @Post('contact')
  async create(@Body() dto: CreateContactDto, @Req() req: any) {
    const ip = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    return this.service.create(dto, {
      ip: String(ip ?? ''),
      userAgent: String(userAgent ?? ''),
    });
  }

  // ===== Admin =====
  @UseGuards(JwtAuthGuard, ActionGuard)
  @Get('admin/contacts')
  @Action('contacts.read')
  async list(@Query() q: ListContactDto) {
    return this.service.list(q);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Get('admin/contacts/:id')
  @Action('contacts.read')
  async get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Patch('admin/contacts/:id')
  @Action('contacts.update')
  async update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.service.update(id, dto);
  }
}
