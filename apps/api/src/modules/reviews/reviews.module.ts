import { Module } from '@nestjs/common';
import { ReviewController } from 'src/modules/reviews/reviews.controller';
import { ReviewService } from 'src/modules/reviews/reviews.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewsModule {}
