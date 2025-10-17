import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AssignPermissionsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissionNames: string[]; 
}
