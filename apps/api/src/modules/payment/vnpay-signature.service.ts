import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as qs from 'qs';

@Injectable()
export class VnpaySignatureService {
  private readonly secret = process.env.VNPAY_HASH_SECRET!; // nhớ add env

  sortObject(obj: Record<string, any>) {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj)
      .filter((k) => obj[k] !== undefined && obj[k] !== null)
      .map((k) => encodeURIComponent(k))
      .sort();

    for (const k of keys) {
      // giống logic replace %20 -> +
      sorted[k] = encodeURIComponent(obj[decodeURIComponent(k)]).replace(
        /%20/g,
        '+',
      );
    }
    return sorted;
  }

  sign(params: Record<string, any>) {
    const sorted = this.sortObject(params);
    const signData = qs.stringify(sorted, { encode: false });
    return crypto
      .createHmac('sha512', this.secret)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');
  }

  verify(params: Record<string, any>, secureHash: string) {
    const signed = this.sign(params);
    return signed === secureHash;
  }
}
