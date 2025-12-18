// payment/payment.controller.ts
import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateVnpayPaymentDto } from './dto/create-vnpay-payment.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('bookings/:bookingId/payments')
export class PaymentController {
  constructor(private payment: PaymentService) {}

  @Post('/vnpay')
  async createVnpay(
    @Param('bookingId') bookingId: string,
    @Body() dto: CreateVnpayPaymentDto,
    @Req() req: any,
  ) {
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress;

    const userId = req.user.id; // theo auth guard của bạn
    return this.payment.createVnpayPaymentUrl(userId, bookingId, dto, ipAddr);
  }
}
