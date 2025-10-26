import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateWardDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Length(2, 10)
  code!: string;

  @IsString()
  @IsNotEmpty()
  districtId!: string;
}
