import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class SetActionPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissionNames: string[]; // ví dụ: ["MANAGE_HOTEL","VIEW_HOTEL"]
}
