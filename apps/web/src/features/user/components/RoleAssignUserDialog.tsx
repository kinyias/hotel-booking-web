'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  roleAssignUserFormSchema,
  RoleAssignUserFormValues,
} from '../validator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRolesQuery } from '@/features/roles';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { User } from '../types';
import toast from 'react-hot-toast';

interface RoleAssignUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (values: RoleAssignUserFormValues) => void;
  isSubmitting: boolean;
}

function RoleAssignUserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  isSubmitting,
}: RoleAssignUserDialogProps) {
  const form = useForm<RoleAssignUserFormValues>({
    resolver: zodResolver(roleAssignUserFormSchema),
    defaultValues: {
      roleIds: user?.roles.map((r) => r.id) || [],
    },
  });
  const { data } = useRolesQuery();
  const [inputValue, setInputValue] = useState('');
  const [openPopover, setOpenPopover] = useState(false);
  const [removedBaseRoles, setRemovedBaseRoles] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const roles = data || [];

  const handleSubmit = async (values: RoleAssignUserFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  useEffect(() => {
    if (user) {
      form.reset({ roleIds: user?.roles.map((r) => r.id) || [] });
    }
  }, [user, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Roles to User</DialogTitle>
          <DialogDescription>
            Search and select roles to assign to this user.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="text-sm text-muted-foreground">
              User:{' '}
              <span className="font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </span>
            </div>

            <FormField
              control={form.control}
              name="roleIds"
              render={({ field }) => {
                const selectedIds = [
                  ...(field.value ?? []),
                  ...(user?.roles
                    .map((r) => r.id)
                    .filter((id) => !removedBaseRoles.includes(id)) ??
                    []),
                ];

                const selectedRoles =
                  roles?.filter((r) => selectedIds.includes(r.id)) || [];

                const filteredSuggestions =
                  roles?.filter(
                    (r) =>
                      r.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                      !selectedIds.includes(r.id)
                  ) || [];

                const addRole = (id: string) => {
                  field.onChange([...field.value, id]);
                  setInputValue('');
                  inputRef.current?.focus();
                };

                const removeRole = (id: string) => {
                  if (user?.roles.some((r) => r.id === id)) {
                    setRemovedBaseRoles((prev) => [...prev, id]);
                  }

                  field.onChange(
                    field.value?.filter((rid) => rid !== id) ?? []
                  );
                };

                return (
                  <FormItem>
                    <FormLabel>Roles</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {/* Display selected roles as badges */}
                        {selectedRoles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedRoles.map((role) => (
                              <Badge
                                key={role.id}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => removeRole(role.id)}
                              >
                                {role.name} ✕
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Autocomplete input with popover */}
                        <div className="relative">
                          <Input
                            ref={inputRef}
                            placeholder="Search roles..."
                            value={inputValue}
                            onChange={(e) => {
                              setInputValue(e.target.value);
                              setOpenPopover(e.target.value.length > 0);
                            }}
                            onFocus={() => {
                              setOpenPopover(true);
                            }}
                            onBlur={() => {
                              // Delay to allow clicking on popover items
                              setTimeout(() => setOpenPopover(false), 200);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && inputValue.trim()) {
                                e.preventDefault();
                                // Try exact match first
                                let found = roles?.find(
                                  (r) =>
                                    r.name.toLowerCase() ===
                                    inputValue.toLowerCase()
                                );
                                // If no exact match, use first filtered suggestion
                                if (!found && filteredSuggestions.length > 0) {
                                  found = filteredSuggestions[0];
                                }
                                if (!found && filteredSuggestions.length == 0) {
                                  toast.error('Role not found');
                                }
                                if (found && !field.value.includes(found.id)) {
                                  addRole(found.id);
                                }
                              }
                              if (e.key === 'Escape') {
                                setOpenPopover(false);
                              }
                            }}
                          />

                          {openPopover && filteredSuggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                              <Command>
                                <CommandList>
                                  {filteredSuggestions.map((role) => (
                                    <CommandItem
                                      key={role.id}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        addRole(role.id);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      {role.name}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Assigning' : 'Assign Roles'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default RoleAssignUserDialog;