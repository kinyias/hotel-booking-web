// payment/dto/create-vnpay-payment.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class CreateVnpayPaymentDto {
  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsString()
  locale?: 'vn' | 'en';
}
