import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class SetActionPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissionIds: string[]; 
}
