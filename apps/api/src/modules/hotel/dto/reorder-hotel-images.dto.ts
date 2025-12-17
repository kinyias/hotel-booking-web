import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

class ReorderItemDto {
  @IsString()
  hotelImageId!: string;

  @Type(() => Number)
  @IsInt()
  position!: number;
}

export class ReorderHotelImagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items!: ReorderItemDto[];
}
