import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AssignRolesToUserDto {
  @IsString()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roleIds: string[];
}
