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
import { User } from '../types';
import { userFormSchema, UserFormValues } from '../validator';
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
import { useRolesQuery } from '@/features/roles';
import { Checkbox } from '@/components/ui/checkbox';
interface UserEditFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: (data: UserFormValues) => Promise<void>;
}
function UserEditFormDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserEditFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      roles: user?.roles?.map((r) => r.id) || [],
    },
  });
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        roles: user.roles?.map((r) => r.id) || [], 
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        roles: [],
      });
    }
  }, [user, form]);
  const { data: roles } = useRolesQuery();
  const handleSubmit = async (data: UserFormValues) => {
    try {
      console.log("hello");
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error('Form submission error:', error);
    }
  };
  const dialogTitle = user ? 'Edit User' : 'Add New User';
  const dialogDescription = user
    ? 'Make changes to the user information here.'
    : 'Add a new user to the system.';
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
                name="firstName"
                render={({ field }) => (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">First Name</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input {...field} placeholder="Enter first name" />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </div>
                  </div>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Last Name</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <Input {...field} placeholder="Enter last name" />
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </div>
                  </div>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <FormLabel className="text-right">Role</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <div className="space-y-2">
                          {roles?.map((role) => (
                            <div
                              key={role.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                              className='cursor-pointer'
                                checked={field.value?.includes(role.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, role.id]);
                                  } else {
                                    field.onChange(
                                      field.value.filter(
                                        (v: string) => v !== role.id
                                      )
                                    );
                                  }
                                }}
                                id={role.id}
                              />
                              <label
                                htmlFor={role.id}
                                className="text-sm font-medium leading-none cursor-pointer"
                              >
                                {role.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs mt-1" />
                    </div>
                  </div>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Add User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UserEditFormDialog;
