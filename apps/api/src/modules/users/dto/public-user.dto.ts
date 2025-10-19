import { Expose, Type } from 'class-transformer';

class PublicImageDto {
  @Expose() id: string;
  @Expose() url: string; // chỉ cần url để FE hiển thị
  @Expose() publicId: string; // nếu FE cần thao tác cloudinary
}
class PublicRoleDto {
  @Expose() id: string;
  @Expose() name: string;
}

export class PublicUserDto {
  @Expose()
  id: string;

  @Expose() 
  firstName?: string | null;

  @Expose() 
  lastName?: string | null;

  // Email chỉ expose nếu đã bật cờ ở service (xem users.service.ts)
  @Expose({ groups: ['private'] })
  email: string;

  @Type(() => PublicRoleDto)
  @Expose()
  roles?: PublicRoleDto[];

  @Expose()
  emailVerified: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Type(() => PublicImageDto)
  @Expose()
  avatar?: PublicImageDto | null;
}
