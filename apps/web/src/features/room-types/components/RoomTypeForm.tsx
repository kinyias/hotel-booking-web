'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

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

interface RoomTypeFormProps {
  initialData?: RoomTypeFormValues;
  onSubmit: (data: RoomTypeFormValues) => void;
  isLoading?: boolean;
}

export function RoomTypeForm({ initialData, onSubmit, isLoading }: RoomTypeFormProps) {
  const form = useForm<RoomTypeFormValues>({
    resolver: zodResolver(roomTypeFormSchema),
    defaultValues: initialData || {
      name: '',
      price_per_night: 0,
      max_guests: 1,
      description: '',
    },
  });

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
                    <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
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
