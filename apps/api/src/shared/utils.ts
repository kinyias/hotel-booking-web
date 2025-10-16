import { createHash, randomBytes } from 'crypto';

export function generateToken(len = 32) {
  // 32 bytes -> 64 hex chars; 
  return randomBytes(len).toString('hex');
}
export function sha256(input: string) {
  return createHash('sha256').update(input).digest('hex');
}
