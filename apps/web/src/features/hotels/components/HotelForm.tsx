'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil, Trash2 } from 'lucide-react';

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
import { hotelFormSchema, HotelFormValues } from '../validator';
import EditorClient from '@/components/common/EditorClient';
import GalleryImagesDialog from '@/components/common/GalleryImagesDialog';
import Image from 'next/image';
import { useState } from 'react';

interface HotelFormProps {
  initialData?: HotelFormValues;
  onSubmit: (data: HotelFormValues) => void;
  isLoading?: boolean;
}

export function HotelForm({ initialData, onSubmit, isLoading }: HotelFormProps) {
  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
      defaultValues: initialData || {
      name: '',
      address: '',
      city: '',
      country: '',
      description: '',
      status: 'DRAFT',
      images: []
    },
  });

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditImage = (index: number) => {
    setEditingIndex(index);
    setGalleryOpen(true);
  };

  const handleRemoveImage = (index: number, currentImages: any[]) => {
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
              form.setValue('images', newImages, { shouldDirty: true, shouldTouch: true });
          }
      } else {
          // Managing entire gallery
          form.setValue('images', images, { shouldDirty: true, shouldTouch: true });
      }
      setGalleryOpen(false);
      setEditingIndex(null);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Hotel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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
        {initialData && 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
}
        {/* Gallery Images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gallery Images</FormLabel>
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingIndex(null);
                    setGalleryOpen(true);
                  }}
                >
                  Manage Gallery
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {(field.value || []).map((img, idx) => (
                  <div key={`${img.url}-${idx}`} className="relative group border rounded-md overflow-hidden">
                    <Image
                      src={img.url}
                      alt="Hotel image"
                      width={320}
                      height={320}
                      className="object-cover w-full h-50 group-hover:opacity-75 transition-opacity"
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
                            onClick={() => handleRemoveImage(idx, field.value || [])}
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
                initialSelected={ editingIndex !== null && field.value?.[editingIndex] ? [field.value[editingIndex]] : (field.value || []) }
                maxSelection={editingIndex !== null ? 1 : undefined}
                onConfirm={handleGalleryConfirm}
              />
            </FormItem>
          )}
        />
        
        <div className="flex justify-start">
             <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Hotel
             </Button>
        </div>
      </form>
    </Form>
  );
}
