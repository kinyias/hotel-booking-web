import * as crypto from 'crypto';
import * as qs from 'qs';

export function sortObject(obj: Record<string, any>) {
  const sorted: Record<string, any> = {};
  const keys = Object.keys(obj).map(encodeURIComponent).sort();
  for (const k of keys) {
    sorted[k] = encodeURIComponent(obj[decodeURIComponent(k)]).replace(
      /%20/g,
      '+',
    );
  }
  return sorted;
}

export function signParams(
  vnpParamsSorted: Record<string, any>,
  hashSecret: string,
) {
  const signData = qs.stringify(vnpParamsSorted, { encode: false });
  return crypto
    .createHmac('sha512', hashSecret)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');
}
