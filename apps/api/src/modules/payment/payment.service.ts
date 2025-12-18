// payment/payment.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateVnpayPaymentDto } from './dto/create-vnpay-payment.dto';
import * as qs from 'qs';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { signParams, sortObject } from 'src/modules/payment/payment.util';

function formatVnpDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async createVnpayPaymentUrl(
    userId: string,
    bookingId: string,
    dto: CreateVnpayPaymentDto,
    ipAddr: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    // rule tối thiểu: chỉ cho pay khi PENDING
    if (booking.status !== 'PENDING')
      throw new BadRequestException('Booking is not payable');

    const tmnCode = this.config.getOrThrow<string>('VNPAY_TMN_CODE');
    const secret = this.config.getOrThrow<string>('VNPAY_HASH_SECRET');
    const vnpUrl = this.config.getOrThrow<string>('VNPAY_URL');
    const returnUrl = this.config.getOrThrow<string>('VNPAY_RETURN_URL');

    // vnp_TxnRef: bạn tự sinh (nên unique + dễ trace)
    const merchantTxnRef = `BK_${booking.id}_${Date.now()}`;

    // tạo Payment record (INIT)
    const payment = await this.prisma.payment.create({
      data: {
        provider: 'VNPAY',
        status: 'INIT',
        bookingId: booking.id,
        amount: booking.totalAmount,
        merchantTxnRef,
        secureHashAlg: 'sha512',
      },
    });

    const locale = dto.locale ?? 'vn';
    const now = new Date();

    const vnpParams: Record<string, any> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: 'VND',
      vnp_TxnRef: merchantTxnRef,
      vnp_OrderInfo: `Thanh toan booking ${booking.id}`, // tương tự mẫu :contentReference[oaicite:3]{index=3}
      vnp_OrderType: 'other',
      vnp_Amount: Number(booking.totalAmount) * 100, // VNPAY nhân 100 :contentReference[oaicite:4]{index=4}
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: formatVnpDate(now),
    };

    if (dto.bankCode) vnpParams.vnp_BankCode = dto.bankCode;

    const sorted = sortObject(vnpParams);
    const secureHash = signParams(sorted, secret);

    sorted.vnp_SecureHash = secureHash; // giống mẫu :contentReference[oaicite:5]{index=5}
    const paymentUrl = `${vnpUrl}?${qs.stringify(sorted, { encode: false })}`;

    // chuyển trạng thái sang PENDING ngay sau khi đã cấp URL
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'PENDING' },
    });

    return { paymentId: payment.id, merchantTxnRef, paymentUrl };
  }
}
