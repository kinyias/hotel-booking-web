'use client';

import { useState } from 'react';
import { useReviewsQuery } from '../queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Star } from 'lucide-react';
import Image from 'next/image';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ReviewListProps {
  hotelId: string;
}

export default function ReviewList({ hotelId }: ReviewListProps) {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data: reviewsResponse, isLoading } = useReviewsQuery(hotelId, { page, limit });
  const reviews = reviewsResponse?.items || [];
  const meta = reviewsResponse?.total || 0;
  const totalPages = Math.max(1, Math.ceil(meta / limit));

  if (isLoading) {
    return <div className="text-gray-500">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-gray-500 italic">No reviews yet for this hotel.</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Guest Reviews ({meta})</h3>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <div className="flex items-start gap-4">
               <Avatar className="w-10 h-10 border border-gray-200">
                  <AvatarImage src={review.user?.avatar?.secureUrl} />
                  <AvatarFallback>{(review.user?.firstName?.[0] || 'G')}{(review.user?.lastName?.[0] || '')}</AvatarFallback>
               </Avatar>
               
               <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                     <span className="font-semibold text-gray-900">
                        {review.user?.firstName} {review.user?.lastName}
                     </span>
                     <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                     </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                     {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                           key={i} 
                           className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                     ))}
                  </div>
                  
                  {review.title && <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>}
                  {review.content && <p className="text-gray-600 leading-relaxed mb-3">{review.content}</p>}
                  
                  {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                          {review.images.map((img) => (
                            <Dialog key={img.id}>
                                <DialogTrigger asChild>
                                    <div className="relative w-24 h-24 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border hover:opacity-90 transition-opacity">
                                        <Image 
                                            src={img.url} 
                                            alt="Review image" 
                                            fill 
                                            className="object-cover" 
                                        />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-[90vw] lg:max-w-4xl h-auto border-none p-0 shadow-none">
                                  <DialogHeader className="sr-only">
                                    <DialogTitle>Review Image</DialogTitle>
                                  </DialogHeader>
                                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/5 shadow-2xl backdrop-blur-sm md:aspect-video">
                                    <Image
                                      src={img.url}
                                      alt="Review image"
                                      fill
                                      className="object-contain transition-all duration-500 hover:scale-[1.02]"
                                      priority
                                    />
                                  </div>
                                </DialogContent>
                            </Dialog>
                          ))}
                      </div>
                  )}
               </div>
            </div>
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
             <EllipsisPagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
        </div>
      )}
    </div>
  );
}
