import { Expose, Transform, Type } from 'class-transformer';

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

  @Expose({ groups: ['private'] })
  email: string;
  @Expose()
  @Type(() => PublicRoleDto)
  @Transform(({ obj }) => obj.roles?.map((ur: any) => ur.role) ?? [], { toClassOnly: true })
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
