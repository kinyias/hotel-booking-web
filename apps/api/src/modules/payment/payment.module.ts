import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { VnpaySignatureService } from 'src/modules/payment/vnpay-signature.service';
import { MailService } from 'src/modules/mail/mail.service';

@Module({
  providers: [PaymentService, VnpaySignatureService, MailService],
  controllers: [PaymentController],
})
export class PaymentModule {}
