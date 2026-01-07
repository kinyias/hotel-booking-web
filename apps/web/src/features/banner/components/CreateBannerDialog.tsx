'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateBannerMutation } from '../mutations';
import { createBannerSchema, CreateBannerFormData } from '../validator';
import { BannerLinkType } from '../types';
import { toast } from 'react-hot-toast';
import { X, ImagePlus, Calendar as CalendarIcon } from 'lucide-react';
import GalleryImagesDialog from '@/components/common/GalleryImagesDialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreateBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBannerDialog({ open, onOpenChange }: CreateBannerDialogProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const createMutation = useCreateBannerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateBannerFormData>({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      isActive: true,
      position: 0,
      linkType: BannerLinkType.URL,
    },
  });

  const isActive = watch('isActive');
  const linkType = watch('linkType');

  const onSubmit = async (data: CreateBannerFormData) => {
    try {
      const filteredImages = imageUrls.filter((url) => url.trim() !== '');
      
      if (filteredImages.length === 0) {
        toast.error('At least one image is required');
        return;
      }

      await createMutation.mutateAsync({
        ...data,
        images: filteredImages,
        startAt: data.startAt || undefined,
        endAt: data.endAt || undefined,
      });

      toast.success('Banner created successfully');
      onOpenChange(false);
      reset();
      setImageUrls([]);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create banner');
    }
  };

  const addImageSlot = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageSlot = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setValue('images', newUrls.filter((url) => url.trim() !== ''));
  };

  const openGalleryForImage = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const handleGalleryConfirm = (images: { id?: string; url: string }[]) => {
    if (currentImageIndex !== null && images.length > 0) {
      const newUrls = [...imageUrls];
      newUrls[currentImageIndex] = images[0].url;
      setImageUrls(newUrls);
      setValue('images', newUrls.filter((url) => url.trim() !== ''));
    }
    setGalleryOpen(false);
    setCurrentImageIndex(null);
  };

  const startAt = watch('startAt');
  const endAt = watch('endAt');

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-[50vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Banner</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ... other fields ... */}
            
            <div className="space-y-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input id="title" {...register('title')} placeholder="Enter banner title" />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle (Optional)</Label>
              <Textarea id="subtitle" {...register('subtitle')} placeholder="Enter banner subtitle" rows={2} />
              {errors.subtitle && <p className="text-sm text-red-500">{errors.subtitle.message}</p>}
            </div>
            
             <div className="space-y-2">
              {imageUrls.length === 0 && (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <ImagePlus className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-3">No images added yet</p>
                  <Button type="button" variant="outline" size="sm" onClick={addImageSlot}>
                    Add Image
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => openGalleryForImage(index)}
                        >
                          <ImagePlus className="h-4 w-4 mr-2" />
                          {url ? 'Change Image' : 'Select from Gallery'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImageSlot(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {url && (
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={url}
                            alt={`Banner image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <div className="p-2 bg-gray-50 text-xs text-gray-600 truncate">
                            {url}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errors.images && <p className="text-sm text-red-500">{errors.images.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link (Optional)</Label>
              <Input id="link" {...register('link')} placeholder="Enter link URL or ID" />
              {errors.link && <p className="text-sm text-red-500">{errors.link.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkType">Link Type</Label>
              <Select
                value={linkType}
                onValueChange={(value) => setValue('linkType', value as BannerLinkType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BannerLinkType.URL}>URL</SelectItem>
                  <SelectItem value={BannerLinkType.HOTEL}>Hotel</SelectItem>
                  <SelectItem value={BannerLinkType.NEWS}>News</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  {...register('position', { valueAsNumber: true })}
                  placeholder="0"
                />
                {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Active</Label>
                <div className="flex items-center h-10">
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('isActive', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startAt && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startAt ? format(new Date(startAt), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startAt ? new Date(startAt) : undefined}
                      onSelect={(date) => setValue('startAt', date ? date.toISOString() : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.startAt && <p className="text-sm text-red-500">{errors.startAt.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endAt && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endAt ? format(new Date(endAt), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endAt ? new Date(endAt) : undefined}
                      onSelect={(date) => setValue('endAt', date ? date.toISOString() : '')}
                      initialFocus
                      disabled={startAt ? { before: new Date(startAt) } : undefined}
                    />
                  </PopoverContent>
                </Popover>
                {errors.endAt && <p className="text-sm text-red-500">{errors.endAt.message}</p>}
              </div>
            </div>


            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Banner'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <GalleryImagesDialog
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        maxSelection={1}
        onConfirm={handleGalleryConfirm}
        initialSelected={
          currentImageIndex !== null && imageUrls[currentImageIndex]
            ? [{ url: imageUrls[currentImageIndex] }]
            : []
        }
      />
    </>
  );
}

