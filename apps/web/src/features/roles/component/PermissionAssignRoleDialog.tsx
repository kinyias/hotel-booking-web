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
  permissionAssignRoleFormSchema,
  PermissionAssignRoleFormValues,
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
import { usePermissionsQuery } from '@/features/permissions';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';

interface PermissionAssignRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string | null;
  onSubmit: (values: PermissionAssignRoleFormValues) => void;
  isSubmitting: boolean;
}

function PermissionAssignRoleDialog({
  open,
  onOpenChange,
  roleId,
  onSubmit,
  isSubmitting,
}: PermissionAssignRoleDialogProps) {
  const form = useForm<PermissionAssignRoleFormValues>({
    resolver: zodResolver(permissionAssignRoleFormSchema),
    defaultValues: {
      roleId: roleId || '',
      permissionIds: [],
    },
  });

  const { data } = usePermissionsQuery();
  const [inputValue, setInputValue] = useState('');
  const [openPopover, setOpenPopover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const permissions = data?.data || [];

  const handleSubmit = async (values: PermissionAssignRoleFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  useEffect(() => {
    if (roleId) {
      form.reset({ roleId, permissionIds: [] });
    }
  }, [roleId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Permissions to Role</DialogTitle>
          <DialogDescription>
            Search and select permissions to assign to this role.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="text-sm text-muted-foreground">
              Role ID:{' '}
              <span className="font-medium text-foreground">{roleId}</span>
            </div>

            <FormField
              control={form.control}
              name="permissionIds"
              render={({ field }) => {
                const selectedPermissions =
                  permissions?.filter((p) => field.value.includes(p.id)) || [];

                const filteredSuggestions =
                  permissions?.filter(
                    (p) =>
                      p.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                      !field.value.includes(p.id)
                  ) || [];

                const addPermission = (id: string) => {
                  field.onChange([...field.value, id]);
                  setInputValue('');
                  setOpenPopover(false);
                  inputRef.current?.focus();
                };

                const removePermission = (id: string) => {
                  field.onChange(field.value.filter((pid) => pid !== id));
                };

                return (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        {/* Display selected permissions as badges */}
                        {selectedPermissions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedPermissions.map((permission) => (
                              <Badge
                                key={permission.id}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => removePermission(permission.id)}
                              >
                                {permission.name} ✕
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Autocomplete input with popover */}
                        <div className="relative">
                          <Input
                            ref={inputRef}
                            placeholder="Search permissions..."
                            value={inputValue}
                            onChange={(e) => {
                              setInputValue(e.target.value);
                              setOpenPopover(e.target.value.length > 0);
                            }}
                            onFocus={() => {
                              // if (inputValue.length > 0) {
                              setOpenPopover(true);
                              // }
                            }}
                            onBlur={() => {
                              // Delay to allow clicking on popover items
                              setTimeout(() => setOpenPopover(false), 200);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && inputValue.trim()) {
                                e.preventDefault();
                                // Try exact match first
                                let found = permissions?.find(
                                  (p) =>
                                    p.name.toLowerCase() ===
                                    inputValue.toLowerCase()
                                );
                                // If no exact match, use first filtered suggestion
                                if (!found && filteredSuggestions.length > 0) {
                                  found = filteredSuggestions[0];
                                }
                                if (found && !field.value.includes(found.id)) {
                                  addPermission(found.id);
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
                                  {filteredSuggestions.map((permission) => (
                                    <CommandItem
                                      key={permission.id}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        addPermission(permission.id);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      {permission.name}
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
                {isSubmitting ? "Assigning" : "Assign Permissions"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PermissionAssignRoleDialog;
