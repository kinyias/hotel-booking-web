import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(@Req() req: Request, @Query('page') page?: number, @Query('limit') limit?: number) {
    const userId = (req.user as any).id;
    return this.notificationService.findAllByUser(userId, page, limit);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.notificationService.getUnreadCount(userId);
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req: Request) {
    const userId = (req.user as any).id;
    await this.notificationService.markAllAsRead(userId);
    return { ok: true };
  }

  @Patch(':id/read')
  async markAsRead(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).id;
    await this.notificationService.markAsRead(id, userId);
    return { ok: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as any).id;
    await this.notificationService.remove(id, userId);
  }
}
