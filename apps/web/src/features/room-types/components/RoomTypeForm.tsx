'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil, Trash2, Check, ChevronsUpDown, X } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { roomTypeFormSchema, RoomTypeFormValues } from '../validator';
import GalleryImagesDialog from '@/components/common/GalleryImagesDialog';
import { useGetAmenitiesQuery } from '@/features/amentites/queries';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { formatNumber, parseCurrency } from '@/utils/currency';

interface RoomTypeFormProps {
  initialData?: RoomTypeFormValues;
  onSubmit: (data: RoomTypeFormValues) => void;
  isLoading?: boolean;
}

export function RoomTypeForm({ initialData, onSubmit, isLoading }: RoomTypeFormProps) {
  const [amenityQuery, setAmenityQuery] = useState<string>('');
  const debouncedQuery = useDebounce(amenityQuery, 500);
  const form = useForm<RoomTypeFormValues>({
    resolver: zodResolver(roomTypeFormSchema),
    defaultValues: initialData || {
      name: '',
      price_per_night: '0',
      max_guests: 1,
      description: '',
      images: [],
      amenityIds: [],
    },
  });
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [amenityOpen, setAmenityOpen] = useState(false);

  const { data: amenitiesData } = useGetAmenitiesQuery({ page: 1, limit: 100, q: debouncedQuery });
  const amenities = amenitiesData?.data || [];
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Room Type Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Per Night */}
            <FormField
              control={form.control}
              name="price_per_night"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Per Night</FormLabel>
                  <FormControl>
                     <Input type="text" min={0} placeholder="299000" {...field}
                          value={formatNumber(Number(field.value))}
                          onBlur={(e) =>
                            field.onChange(parseCurrency(e.target.value))
                          } 
                          onChange={(e) =>
                            field.onChange(parseCurrency(e.target.value))
                          } 
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Max Guests */}
            <FormField
              control={form.control}
              name="max_guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Guests</FormLabel>
                  <FormControl>
                    <Input 
                        type="number" 
                        placeholder="1" 
                        min={1}
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                    />
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
                <Textarea
                  placeholder="Room Type Description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amenities Multi-Select */}
        <FormField
          control={form.control}
          name="amenityIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <Popover open={amenityOpen} onOpenChange={setAmenityOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <div
                      className={cn(
                        "flex min-h-[40px] w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      )}
                    >
                        <div className="flex flex-wrap gap-1">
                            {field.value && field.value.length > 0 ? (
                                field.value.map((id) => {
                                    const amenity = amenities.find((a) => a.id === id);
                                    return (
                                        <Badge key={id} variant="secondary" className="mr-1 mb-1">
                                            {amenity?.label || id}
                                            <span
                                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newValue = field.value?.filter((val) => val !== id);
                                                    field.onChange(newValue);
                                                }}
                                            >
                                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                            </span>
                                        </Badge>
                                    );
                                })
                            ) : (
                                <span className="text-muted-foreground mt-1">Select amenities...</span>
                            )}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
                    </div>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search amenities..."  value={amenityQuery}
                      onValueChange={(value) => {
                        setAmenityQuery(value);
                      }} />
                    <CommandList>
                        <CommandEmpty>No amenity found.</CommandEmpty>
                        <CommandGroup>
                        {amenities.map((amenity) => (
                            <CommandItem
                            key={amenity.id}
                            value={amenity.label}
                            onSelect={() => {
                                const current = field.value || [];
                                const isSelected = current.includes(amenity.id);
                                if (isSelected) {
                                    field.onChange(current.filter((id) => id !== amenity.id));
                                } else {
                                    field.onChange([...current, amenity.id]);
                                }
                            }}
                            >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                (field.value || []).includes(amenity.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                            />
                            {amenity.label}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  <div key={`${img.url}-${idx}`} className="relative group border rounded-md overflow-hidden aspect-square">
                    <Image
                      src={img.url}
                      alt="Room type image"
                      fill
                      className="object-cover transition-opacity group-hover:opacity-75"
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
              Save Room Type
             </Button>
        </div>
      </form>
    </Form>
  );
}
