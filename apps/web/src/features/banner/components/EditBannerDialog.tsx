'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateBannerMutation } from '../mutations';
import { updateBannerSchema, UpdateBannerFormData } from '../validator';
import { Banner, BannerLinkType } from '../types';
import { toast } from 'react-hot-toast';
import { X, ImagePlus } from 'lucide-react';
import GalleryImagesDialog from '@/components/common/GalleryImagesDialog';

interface EditBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: Banner | null;
}

export function EditBannerDialog({ open, onOpenChange, banner }: EditBannerDialogProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
  const updateMutation = useUpdateBannerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UpdateBannerFormData>({
    resolver: zodResolver(updateBannerSchema),
  });

  const isActive = watch('isActive');
  const linkType = watch('linkType');

  useEffect(() => {
    if (banner) {
      reset({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        link: banner.link || '',
        linkType: banner.linkType,
        position: banner.position,
        isActive: banner.isActive,
        startAt: banner.startAt ? new Date(banner.startAt).toISOString().slice(0, 16) : '',
        endAt: banner.endAt ? new Date(banner.endAt).toISOString().slice(0, 16) : '',
      });
      setImageUrls(banner.images.map((img) => img.url));
    }
  }, [banner, reset]);

  const onSubmit = async (data: UpdateBannerFormData) => {
    if (!banner) return;

    try {
      const filteredImages = imageUrls.filter((url) => url.trim() !== '');
      
      if (filteredImages.length === 0) {
        toast.error('At least one image is required');
        return;
      }

      await updateMutation.mutateAsync({
        id: banner.id,
        input: {
          ...data,
          images: filteredImages,
          startAt: data.startAt || undefined,
          endAt: data.endAt || undefined,
        },
      });

      toast.success('Banner updated successfully');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update banner');
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

  if (!banner) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="min-w-[50vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            className="w-full h-32 object-cover"
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
                <Label htmlFor="startAt">Start Date (Optional)</Label>
                <Input id="startAt" type="datetime-local" {...register('startAt')} />
                {errors.startAt && <p className="text-sm text-red-500">{errors.startAt.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endAt">End Date (Optional)</Label>
                <Input id="endAt" type="datetime-local" {...register('endAt')} />
                {errors.endAt && <p className="text-sm text-red-500">{errors.endAt.message}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update Banner'}
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

