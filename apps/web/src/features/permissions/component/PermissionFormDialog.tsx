'use client';
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Permission, permissionFormSchema, PermissionFormValues } from '@/features/permissions';

interface PermissionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permission?: Permission | null;
  onSubmit: (data: PermissionFormValues) => Promise<void>;
  isSubmitting: boolean;
}

function PermissionFormDialog({
  open,
  onOpenChange,
  permission,
  onSubmit,
  isSubmitting,
}: PermissionFormDialogProps) {
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: {
      name: permission?.name || '',
      description: permission?.description || '',
    },
  });

  useEffect(() => {
    if (permission) {
      form.reset({
        name: permission.name || '',
        description: permission.description || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [permission, form]);

  const handleSubmit = async (data: PermissionFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const dialogTitle = permission ? 'Edit Permission' : 'Add New Permission';
  const dialogDescription = permission
    ? 'Make changes to the permission information here.'
    : 'Add a new permission to the system.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Name</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input {...field} placeholder="Enter name" />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </div>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Description</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input {...field} placeholder="Enter description" />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </div>
                  </div>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : permission ? 'Update Permission' : 'Add Permission'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PermissionFormDialog;