'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { createReviewSchema, CreateReviewSchema } from '../validator';
import { useCreateReviewMutation } from '../mutations';
import { Star, X } from 'lucide-react';
import GalleryImagesDialog from '@/components/common/GalleryImagesDialog';
import Image from 'next/image';

interface CreateReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  hotelId: string;
}

export default function CreateReviewDialog({
  open,
  onOpenChange,
  bookingId,
  hotelId,
}: CreateReviewDialogProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ id?: string; url: string }[]>([]);
  
  const mutation = useCreateReviewMutation(hotelId);

  const form = useForm<CreateReviewSchema>({
    resolver: zodResolver(createReviewSchema) as any,
    defaultValues: {
      bookingId,
      rating: 5,
      title: '',
      content: '',
      imageIds: [],
    },
  });

  const onSubmit = (data: CreateReviewSchema) => {
    mutation.mutate(
      {
        ...data,
        imageIds: selectedImages.map((img) => img.id).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
          setSelectedImages([]);
        },
      }
    );
  };

  const handleRating = (value: number) => {
    form.setValue('rating', value);
  };

  const currentRating = form.watch('rating');

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with this hotel.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= currentRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
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
                    <Input placeholder="Summary of your visit" {...field} />
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
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your stay..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <FormLabel>Images</FormLabel>
                    <Button type="button" variant="outline" size="sm" onClick={() => setGalleryOpen(true)}>
                        Select Images
                    </Button>
                </div>
                
                {selectedImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                        {selectedImages.map((img, idx) => (
                            <div key={idx} className="relative w-16 h-16 flex-shrink-0">
                                <Image 
                                    src={img.url} 
                                    alt="Review image" 
                                    fill 
                                    className="object-cover rounded-md" 
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    
    <GalleryImagesDialog 
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onConfirm={(images) => {
            setSelectedImages(images);
            setGalleryOpen(false);
        }}
        maxSelection={5}
        initialSelected={selectedImages}
    />
    </>
  );
}
