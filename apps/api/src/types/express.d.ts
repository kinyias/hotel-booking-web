import { HotelMemberRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      hotelId?: string;
      hotelMemberRole?: HotelMemberRole;
    }
  }
}
export {};
