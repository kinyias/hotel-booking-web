'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateReviewMutation } from '@/features/reviews/mutations';
import { updateReviewSchema, UpdateReviewSchema } from '@/features/reviews/validator';
import { Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Review } from '@/features/reviews/types';
import { useEffect } from 'react';

interface UpdateReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
}

export default function UpdateReviewDialog({
  open,
  onOpenChange,
  review,
}: UpdateReviewDialogProps) {
  const updateMutation = useUpdateReviewMutation();

  const form = useForm<UpdateReviewSchema>({
    resolver: zodResolver(updateReviewSchema) as any,
    defaultValues: {
      rating: 5,
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (review && open) {
      form.reset({
        rating: review.rating,
        title: review.title || '',
        content: review.content || '',
      });
    }
  }, [review, open, form]);

  const onSubmit = (data: UpdateReviewSchema) => {
    if (!review) return;

    updateMutation.mutate(
      { id: review.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={cn(
                            "p-1 rounded-full transition-colors hover:bg-gray-100",
                            field.value >= star ? "text-yellow-400" : "text-gray-300"
                          )}
                          onClick={() => field.onChange(star)}
                        >
                          <Star className={cn("w-8 h-8", field.value >= star && "fill-current")} />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Summarize your experience..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your stay..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
