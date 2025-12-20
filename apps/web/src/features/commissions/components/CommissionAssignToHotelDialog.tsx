'use client';

import React, { useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Hotel } from '@/features/hotels/types';
import { useCommissionPackagesQuery } from '../queries';
import { assignCommissionSchema, AssignCommissionFormValues } from '../validator';
import { useSetHotelCommissionPackageMutation } from '../mutations';
import toast from 'react-hot-toast';

interface CommissionAssignToHotelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotel: Hotel | null;
}

export default function CommissionAssignToHotelDialog({
  open,
  onOpenChange,
  hotel,
}: CommissionAssignToHotelDialogProps) {
  const { data: packages, isLoading: isLoadingPackages } = useCommissionPackagesQuery();
  const setCommissionMutation = useSetHotelCommissionPackageMutation();

  const form = useForm<AssignCommissionFormValues>({
    resolver: zodResolver(assignCommissionSchema),
    defaultValues: {
      commissionPackageId: '',
    },
  });

  useEffect(() => {
    if (hotel) {
      form.reset({
        commissionPackageId: hotel.commissionPackageId || '',
      });
    }
  }, [hotel, form]);

  const onSubmit = async (values: AssignCommissionFormValues) => {
    if (!hotel) return;

    try {
      await setCommissionMutation.mutateAsync({
        hotelId: hotel.id,
        commissionPackageId: values.commissionPackageId,
      });
      toast.success('Commission package assigned successfully');
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to assign commission package');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Commission Package</DialogTitle>
          <DialogDescription>
            Select a commission package for <strong>{hotel?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="commissionPackageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Package</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {packages
                        ?.filter((pkg) => pkg.isActive)
                        .map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            {pkg.name} ({pkg.commissionRate * 100}%)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={setCommissionMutation.isPending || isLoadingPackages}
              >
                {setCommissionMutation.isPending ? 'Assigning...' : 'Assign Package'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
