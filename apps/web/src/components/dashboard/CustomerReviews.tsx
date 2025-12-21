'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight } from "lucide-react";
import { useLatestReviewsQuery } from "@/features/dashboard/queries";
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { ROUTES } from "@/constants";

interface CustomerReviewsProps {
  hotelId?: string;
}

export function CustomerReviews({ hotelId }: CustomerReviewsProps) {
  const { data: reviews, isLoading } = useLatestReviewsQuery(hotelId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
           <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
           {[1,2,3].map(i => (
             <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                   <Skeleton className="h-4 w-1/3" />
                   <Skeleton className="h-16 w-full" />
                </div>
             </div>
           ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Latest Customer Review</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews?.map((review) => (
          <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
            <Link href={ROUTES.ADMIN_REVIEW + '/' + hotelId}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.avatar?.secureUrl} />
                  <AvatarFallback>{review.user.firstName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{review.user.firstName} {review.user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating 
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{review.content}</p>
            </Link>
          </div>
        ))}
         {reviews?.length === 0 && (
            <p className="text-center text-muted-foreground py-4">No reviews yet.</p>
         )}
        <Button variant="ghost" className="w-full" asChild>
          <Link href={`/admin/reviews${hotelId ? '/' + hotelId : ''}`}>
             See more<ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
