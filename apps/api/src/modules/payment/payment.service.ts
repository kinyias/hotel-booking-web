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
import { BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { VnpaySignatureService } from 'src/modules/payment/vnpay-signature.service';
import { MailService } from 'src/modules/mail/mail.service';

function formatVnpDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
function parseVnpPayDate(vnpPayDate?: string) {
  // vnp_PayDate: YYYYMMDDHHmmss
  if (!vnpPayDate) return null;
  const s = vnpPayDate;
  if (!/^\d{14}$/.test(s)) return null;
  const yyyy = Number(s.slice(0, 4));
  const MM = Number(s.slice(4, 6)) - 1;
  const dd = Number(s.slice(6, 8));
  const HH = Number(s.slice(8, 10));
  const mm = Number(s.slice(10, 12));
  const ss = Number(s.slice(12, 14));
  return new Date(yyyy, MM, dd, HH, mm, ss); // local time (Asia/Ho_Chi_Minh)
}
@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private readonly vnpSig: VnpaySignatureService,
    private readonly mail: MailService,
  ) {}

  private formatMoneyVnd(amount: any) {
    // amount là Prisma.Decimal
    const n = Number(amount);
    return n.toLocaleString('vi-VN');
  }

  private async sendPaymentSucceededMailOnce(paymentId: string) {
    // check đã gửi chưa
    const existed = await this.prisma.paymentEvent.findFirst({
      where: { paymentId, type: 'MAIL_PAYMENT_SUCCEEDED' },
      select: { id: true },
    });
    if (existed) return;

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          select: {
            id: true,
            guestName: true,
            guestEmail: true,
            checkIn: true,
            checkOut: true,
            userId: true,
            hotel: { select: { name: true } },
          },
        },
      },
    });
    if (!payment) return;

    // ưu tiên guestEmail, fallback sang user.email nếu có userId
    let to = payment.booking.guestEmail ?? null;
    if (!to && payment.booking.userId) {
      const u = await this.prisma.user.findUnique({
        where: { id: payment.booking.userId },
        select: { email: true },
      });
      to = u?.email ?? null;
    }
    if (!to) return; // không có email thì bỏ qua

    try {
      await this.mail.sendPaymentSucceededEmail({
        to,
        guestName: payment.booking.guestName,
        bookingId: payment.booking.id,
        amountVnd: this.formatMoneyVnd(payment.amount),
        hotelName: payment.booking.hotel?.name ?? null,
        checkIn: payment.booking.checkIn.toISOString().slice(0, 10),
        checkOut: payment.booking.checkOut.toISOString().slice(0, 10),
      });

      // ghi event đánh dấu đã gửi
      await this.prisma.paymentEvent.create({
        data: {
          paymentId,
          type: 'MAIL_PAYMENT_SUCCEEDED',
          payload: { to },
        },
      });
    } catch (e) {
      // mail fail KHÔNG làm fail payment, chỉ log để theo dõi
      await this.prisma.paymentEvent.create({
        data: {
          paymentId,
          type: 'MAIL_PAYMENT_FAILED',
          payload: { error: String(e) },
        },
      });
    }
  }

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

  async handleVnpayReturn(query: Record<string, any>) {
    const secureHash = query.vnp_SecureHash;
    const params = { ...query };
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    const ok = this.vnpSig.verify(params, secureHash);
    const merchantTxnRef = params.vnp_TxnRef as string | undefined;

    // Nếu thiếu txnRef thì khỏi làm gì được
    if (!merchantTxnRef) {
      return { ok: false, responseCode: params.vnp_ResponseCode ?? null };
    }

    // Tìm payment theo merchantTxnRef
    const payment = await this.prisma.payment.findUnique({
      where: { merchantTxnRef },
      include: { booking: { select: { id: true, status: true } } },
    });

    // Không có payment => vẫn trả FE biết kết quả verify
    if (!payment) {
      return { ok, responseCode: params.vnp_ResponseCode ?? null };
    }

    // Log RETURN event để audit
    await this.prisma.paymentEvent.create({
      data: {
        paymentId: payment.id,
        type: 'RETURN',
        payload: query,
      },
    });

    // Nếu chữ ký fail => không update trạng thái
    if (!ok) {
      return { ok: false, responseCode: params.vnp_ResponseCode ?? null };
    }

    const rspCode = (params.vnp_ResponseCode as string) ?? null; // "00" success
    const payDate = parseVnpPayDate(params.vnp_PayDate);
    const bankCode = (params.vnp_BankCode as string) ?? null;
    const vnpTransactionNo = (params.vnp_TransactionNo as string) ?? null;
    const transactionStatus = (params.vnp_TransactionStatus as string) ?? null;

    // Idempotent: nếu IPN đã set trạng thái cuối rồi thì không ghi đè
    if (
      payment.status !== PaymentStatus.INIT &&
      payment.status !== PaymentStatus.PENDING
    ) {
      return { ok: true, responseCode: rspCode };
    }

    if (rspCode === '00') {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.SUCCEEDED,
            responseCode: rspCode,
            transactionStatus,
            vnpTransactionNo,
            bankCode,
            payDate,
            secureHashAlg: 'sha512',
          },
        }),
        this.prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: BookingStatus.CONFIRMED },
        }),
      ]);
      await this.sendPaymentSucceededMailOnce(payment.id);
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          responseCode: rspCode,
          transactionStatus,
          vnpTransactionNo,
          bankCode,
          payDate,
          secureHashAlg: 'sha512',
        },
      });
    }

    return { ok: true, responseCode: rspCode };
  }

  async handleVnpayIpn(query: Record<string, any>) {
    // IPN: cập nhật trạng thái payment (giống /vnpay_ipn trong file mẫu) :contentReference[oaicite:3]{index=3}
    const secureHash = query.vnp_SecureHash;
    const params = { ...query };
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    const checksumOk = this.vnpSig.verify(params, secureHash);
    if (!checksumOk) {
      return { RspCode: '97', Message: 'Checksum failed' };
    }

    const merchantTxnRef = params.vnp_TxnRef as string; // unique in schema
    const rspCode = params.vnp_ResponseCode as string; // "00" => success
    const vnpAmount = Number(params.vnp_Amount); // amount*100
    const amountVnd = vnpAmount / 100;

    const payment = await this.prisma.payment.findUnique({
      where: { merchantTxnRef },
      include: { booking: { select: { id: true, status: true } } },
    });

    if (!payment) return { RspCode: '01', Message: 'Order not found' };

    // check amount
    const expected = new Prisma.Decimal(amountVnd);
    if (!payment.amount.equals(expected)) {
      return { RspCode: '04', Message: 'Amount invalid' };
    }

    // idempotent: chỉ cho update khi INIT/PENDING
    if (
      payment.status !== PaymentStatus.INIT &&
      payment.status !== PaymentStatus.PENDING
    ) {
      return {
        RspCode: '02',
        Message: 'This order has been updated to the payment status',
      };
    }

    // log IPN event trước khi update (audit)
    await this.prisma.paymentEvent.create({
      data: {
        paymentId: payment.id,
        type: 'IPN',
        payload: query,
      },
    });

    const payDate = parseVnpPayDate(params.vnp_PayDate);

    if (rspCode === '00') {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.SUCCEEDED,
            responseCode: rspCode,
            transactionStatus: params.vnp_TransactionStatus ?? null,
            vnpTransactionNo: params.vnp_TransactionNo ?? null,
            bankCode: params.vnp_BankCode ?? null,
            payDate,
            secureHashAlg: 'sha512',
          },
        }),
        this.prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: BookingStatus.CONFIRMED },
        }),
      ]);
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          responseCode: rspCode,
          transactionStatus: params.vnp_TransactionStatus ?? null,
          vnpTransactionNo: params.vnp_TransactionNo ?? null,
          bankCode: params.vnp_BankCode ?? null,
          payDate,
          secureHashAlg: 'sha512',
        },
      });
    }

    // VNPAY yêu cầu luôn trả RspCode=00 nếu xử lý OK (kể cả fail/success), giống file mẫu :contentReference[oaicite:4]{index=4}
    return { RspCode: '00', Message: 'Success' };
  }
}
