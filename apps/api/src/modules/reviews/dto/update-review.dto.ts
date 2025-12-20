import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

// moderation (hotel owner/admin) có thể ẩn/hiện
export class ModerateReviewDto {
  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}
