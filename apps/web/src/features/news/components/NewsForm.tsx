'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import EditorClient from '@/components/common/EditorClient';
import GalleryImagesDialog from '@/components/common/GalleryImagesDialog';

import { newsFormSchema, NewsFormValues } from '../validator';
import { NewsStatus } from '../types';

interface NewsFormProps {
  initialData?: NewsFormValues;
  onSubmit: (data: NewsFormValues) => void;
  isLoading?: boolean;
}

export function NewsForm({ initialData, onSubmit, isLoading }: NewsFormProps) {
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: initialData || {
      title: '',
      summary: '',
      content: '',
      status: NewsStatus.DRAFT,
      images: [],
    },
  });

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setGalleryOpen(true);
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue('images', newImages, { shouldDirty: true, shouldTouch: true });
  };

  const handleGalleryConfirm = (images: any[]) => {
    if (editingIndex !== null) {
      // Editing a specific image
      if (images.length > 0) {
        const currentImages = form.getValues('images') || [];
        const newImages = [...currentImages];
        newImages[editingIndex] = images[0];
        form.setValue('images', newImages, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    } else {
      // Managing entire gallery or adding to it?
      // Previous logic in HotelForm replacess entire gallery if editingIndex is null and specific collection handling is not implemented for append.
      // Wait, HotelForm line 76: form.setValue('images', images...) - it REPLACES all images.
      // So if I want to append, I should handle it. But standard behavior here seems to be "select all images you want".
      // GalleryImagesDialog supports multi selection.
      form.setValue('images', images, { shouldDirty: true, shouldTouch: true });
    }
    setGalleryOpen(false);
    setEditingIndex(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="News title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Summary */}
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief summary"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <EditorClient
                  content={field.value || ''}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NewsStatus.DRAFT}>Draft</SelectItem>
                    <SelectItem value={NewsStatus.PUBLISHED}>
                      Published
                    </SelectItem>
                    <SelectItem value={NewsStatus.ARCHIVED}>Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Gallery Images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingIndex(null);
                    setGalleryOpen(true);
                  }}
                >
                  Manage Images
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {(field.value || []).map((img, idx) => (
                  <div
                    key={`${img.url}-${idx}`}
                    className="relative group border rounded-md overflow-hidden"
                  >
                    <Image
                      src={img.url}
                      alt="News image"
                      width={320}
                      height={320}
                      className="object-cover w-full h-40 group-hover:opacity-75 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={() => handleEditImage(idx)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
              <GalleryImagesDialog
                open={galleryOpen}
                onOpenChange={(open) => {
                  setGalleryOpen(open);
                  if (!open) setEditingIndex(null);
                }}
                initialSelected={
                  editingIndex !== null && field.value?.[editingIndex]
                    ? [field.value[editingIndex]]
                    : field.value || []
                }
                maxSelection={editingIndex !== null ? 1 : undefined}
                onConfirm={handleGalleryConfirm}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-start">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save News
          </Button>
        </div>
      </form>
    </Form>
  );
}
