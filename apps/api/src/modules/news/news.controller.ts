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
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ListNewsDto } from './dto/list-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Action } from '../auth/decorator/action.decorator';
import { ActionGuard } from '../auth/guards/action.guard';

@Controller()
export class NewsController {
  constructor(private service: NewsService) {}

  // ===== Public =====
  @Get('news')
  async listPublic(@Query() q: ListNewsDto) {
    return this.service.list(q, false);
  }

  @Get('news/:slug')
  async getPublic(@Param('slug') slug: string) {
    return this.service.getBySlug(slug, false);
  }

  // ===== Admin =====
  @UseGuards(JwtAuthGuard, ActionGuard)
  @Post('admin/news')
  @Action('news.create')
  async create(@Req() req: any, @Body() dto: CreateNewsDto) {
    return this.service.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Get('admin/news')
  @Action('news.read')
  async listAdmin(@Query() q: ListNewsDto) {
    return this.service.list(q, true);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Get('admin/news/id/:id')
  @Action('news.read')
  async getById(@Param('id') id: string) {
    return this.service.getById(id, true);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Patch('admin/news/:id')
  @Action('news.update')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateNewsDto,
  ) {
    return this.service.update(req.user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard, ActionGuard)
  @Delete('admin/news/:id')
  @Action('news.delete')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
