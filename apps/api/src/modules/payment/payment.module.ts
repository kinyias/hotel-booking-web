import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { VnpaySignatureService } from 'src/modules/payment/vnpay-signature.service';

@Module({
  providers: [PaymentService, VnpaySignatureService],
  controllers: [PaymentController]
})
export class PaymentModule {}
