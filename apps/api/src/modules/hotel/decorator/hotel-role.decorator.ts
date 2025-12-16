import { SetMetadata } from '@nestjs/common';
import { HotelMemberRole } from '@prisma/client';

export const HOTEL_ROLES_KEY = 'hotel_roles';

export const RequireHotelRoles = (...roles: HotelMemberRole[]) =>
  SetMetadata(HOTEL_ROLES_KEY, roles);
