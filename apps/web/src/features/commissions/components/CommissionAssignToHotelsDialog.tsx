'use client';

import React, { useEffect, useState, useRef } from 'react';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandList,
  CommandItem,
} from '@/components/ui/command';
import { CommissionPackage } from '../types';
import { useHotelsQuery } from '@/features/hotels/queries';
import { assignCommissionToHotelsSchema, AssignCommissionToHotelsFormValues } from '../validator';
import { useSetHotelCommissionPackageMutation } from '../mutations';
import toast from 'react-hot-toast';

interface CommissionAssignToHotelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commissionPackage: CommissionPackage | null;
}

export default function CommissionAssignToHotelsDialog({
  open,
  onOpenChange,
  commissionPackage,
}: CommissionAssignToHotelsDialogProps) {
  const { data: hotelsData } = useHotelsQuery({ limit: 100 });
  const setCommissionMutation = useSetHotelCommissionPackageMutation();
  const [inputValue, setInputValue] = useState('');
  const [openPopover, setOpenPopover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const hotels = hotelsData?.data || [];

  const form = useForm<AssignCommissionToHotelsFormValues>({
    resolver: zodResolver(assignCommissionToHotelsSchema),
    defaultValues: {
      hotelIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ hotelIds: [] });
      setInputValue('');
    }
  }, [open, form]);

  const onSubmit = async (values: AssignCommissionToHotelsFormValues) => {
    if (!commissionPackage) return;

    try {
      const promises = values.hotelIds.map((hotelId) =>
        setCommissionMutation.mutateAsync({
          hotelId,
          commissionPackageId: commissionPackage.id,
        })
      );

      await Promise.all(promises);
      toast.success(`Commission package assigned to ${values.hotelIds.length} hotels`);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to assign commission package to some hotels');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Hotels to {commissionPackage?.name}</DialogTitle>
          <DialogDescription>
            Search and select hotels to assign to this commission package.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="hotelIds"
              render={({ field }) => {
                const selectedHotels = hotels.filter((h) => field.value.includes(h.id));
                const filteredSuggestions = hotels.filter(
                  (h) =>
                    h.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                    !field.value.includes(h.id)
                );

                const addHotel = (id: string) => {
                  field.onChange([...field.value, id]);
                  setInputValue('');
                  inputRef.current?.focus();
                };

                const removeHotel = (id: string) => {
                  field.onChange(field.value.filter((hotelId) => hotelId !== id));
                };

                return (
                  <FormItem>
                    <FormLabel>Hotels</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {selectedHotels.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedHotels.map((hotel) => (
                              <Badge
                                key={hotel.id}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => removeHotel(hotel.id)}
                              >
                                {hotel.name} ✕
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="relative">
                          <Input
                            ref={inputRef}
                            placeholder="Search hotels..."
                            value={inputValue}
                            onChange={(e) => {
                              setInputValue(e.target.value);
                              setOpenPopover(e.target.value.length > 0);
                            }}
                            onFocus={() => setOpenPopover(inputValue.length > 0)}
                            onBlur={() => setTimeout(() => setOpenPopover(false), 200)}
                          />

                          {openPopover && filteredSuggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                              <Command>
                                <CommandList>
                                  {filteredSuggestions.map((hotel) => (
                                    <CommandItem
                                      key={hotel.id}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        addHotel(hotel.id);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      {hotel.name}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </Command>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={setCommissionMutation.isPending}>
                {setCommissionMutation.isPending ? 'Assigning...' : 'Assign Hotels'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
