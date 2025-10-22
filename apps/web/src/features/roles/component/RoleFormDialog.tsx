'use client';
import React, { useEffect, useState } from 'react';
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
import { Role, roleFormSchema, RoleFormValues } from '@/features/roles';
interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
  onSubmit: (data: RoleFormValues) => Promise<void>;
  isSubmitting: boolean;
}
function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSubmit,
  isSubmitting,
}: RoleFormDialogProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
    },
  });
  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name || '',
        description: role.description || '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
      });
    }
  }, [role]);
  const handleSubmit = async (data: RoleFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  const dialogTitle = role ? 'Edit Role' : 'Add New Role';
  const dialogDescription = role
    ? 'Make changes to the role information here.'
    : 'Add a new role to the system.';
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
              {/* First Name */}
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

              {/* Last Name */}
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
                {isSubmitting ? 'Saving...' : role ? 'Update Role' : 'Add Role'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default RoleFormDialog;
