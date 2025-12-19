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
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateVnpayPaymentDto } from './dto/create-vnpay-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller()
export class PaymentController {
  constructor(private payment: PaymentService) {}

  @Post('bookings/:bookingId/payments/vnpay')
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

  @Public()
  @Get('payments/vnpay/return')
  async vnpayReturn(@Query() query: any, @Res() res: Response) {
    const result = await this.payment.handleVnpayReturn(query);
    const status =
    result.ok && result.responseCode === '00'
      ? 'success'
      : 'failed';

  const feUrl =
    process.env.PUBLIC_WEB_URL ??
    'http://localhost:3000';

  return res.redirect(
    `${feUrl}/payment-result?payment_status=${status}` +
    `&booking_id=${result.bookingId ?? ''}`
  );
  }

  @Public()
  @Get('payments/vnpay/ipn')
  async vnpayIpn(@Query() query: any, @Res() res: Response, @Req() req: any) {
    console.log('HIT IPN', req.query);

    const result = await this.payment.handleVnpayIpn(query);
    return res.status(200).json(result);
  }
}
