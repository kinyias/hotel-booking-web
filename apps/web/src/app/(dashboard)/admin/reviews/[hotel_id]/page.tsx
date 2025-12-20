'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  useModerationReviewsQuery,
} from '@/features/reviews/queries';
import {
  useModerateReviewMutation,
  useDeleteReviewMutation,
} from '@/features/reviews/mutations';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import { Eye, EyeOff, Search, Star, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConfirmDialog } from "@/components/common/CofirmDialog";

export default function HotelReviewModerationPage() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState<string | null>(null);
  const params = useParams();
  const hotelId = params.hotel_id as string;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;
  const { data: reviewsResponse, isLoading } = useModerationReviewsQuery(hotelId, {
    page,
    limit,
    q: search,
  });

  const reviews = reviewsResponse?.items || [];
  const meta = reviewsResponse?.total || 0;
  const totalPages = Math.ceil(meta / limit);

  const moderateMutation = useModerateReviewMutation(hotelId);
  const deleteMutation = useDeleteReviewMutation(hotelId);

  const handleToggleHide = (reviewId: string, currentHidden: boolean) => {
    moderateMutation.mutate({ id: reviewId, isHidden: !currentHidden });
  };
  const confirmDelete = (reviewId: string) => {
    setReviewIdToDelete(reviewId);
    setOpenDeleteDialog(true);
  };
  const handleDelete = () => {
    if (reviewIdToDelete) {
      deleteMutation.mutate(reviewIdToDelete);
      setOpenDeleteDialog(false);
    }
  };
  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-sm:max-w-none max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews content..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
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
                  Loading reviews...
                </TableCell>
              </TableRow>
            ) : reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400 italic">
                  No reviews found for this hotel.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.user?.avatar?.secureUrl} />
                        <AvatarFallback>
                          {review.user?.firstName?.[0]}
                          {review.user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {review.user?.firstName} {review.user?.lastName}
                        </span>
                      </div>
                    </div>
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
                      <span className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
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
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        title={review.isHidden ? 'Show Review' : 'Hide Review'}
                        onClick={() => handleToggleHide(review.id, !!review.isHidden)}
                        disabled={moderateMutation.isPending}
                      >
                        {review.isHidden ? (
                          <Eye className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-amber-600" />
                        )}
                      </Button>
                       <Button onClick={() => confirmDelete(review.id)} size="icon" variant="ghost" title="Delete Review" className="text-rose-600">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    </div>
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
      <ConfirmDialog
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleDelete}
        open={openDeleteDialog}
        onCancel={() => setOpenDeleteDialog(false)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
