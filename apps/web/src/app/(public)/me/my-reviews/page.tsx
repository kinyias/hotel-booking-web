'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyReviewsQuery } from '@/features/reviews/queries';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import { Edit, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Review } from '@/features/reviews/types';
import UpdateReviewDialog from '@/features/reviews/components/UpdateReviewDialog';

export default function MyReviewsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // State for edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const { data: reviewsResponse, isLoading } = useMyReviewsQuery({
    page,
    limit,
  });

  const reviews = reviewsResponse?.items || [];
  const meta = reviewsResponse?.total || 0;
  const totalPages = Math.max(1, Math.ceil(meta / limit));

  const handleEditClick = (review: Review) => {
    setSelectedReview(review);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hotel</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400 italic">
                  Loading your reviews...
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400 italic">
                  You haven't written any reviews yet.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">
                     {review.hotel?.name || 'Unknown Hotel'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{review.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="flex flex-col">
                      {review.title && <span className="font-bold text-sm block mb-0.5">{review.title}</span>}
                      <span className="text-gray-600 text-sm line-clamp-2">
                        {review.content}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {review.isHidden ? (
                      <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                        Hidden
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Visible
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditClick(review)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <EllipsisPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <UpdateReviewDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        review={selectedReview} 
      />
    </div>
  );
}
