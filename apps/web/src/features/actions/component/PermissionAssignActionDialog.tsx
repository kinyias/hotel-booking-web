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
  permissionAssignActionFormSchema,
  PermissionAssignActionFormValues,
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
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import toast from 'react-hot-toast';
import { RoleAction } from '../types';

interface PermissionAssignActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: RoleAction | null;
  onSubmit: (values: PermissionAssignActionFormValues) => void;
  isSubmitting: boolean;
}

function PermissionAssignActionDialog({
  open,
  onOpenChange,
  action,
  onSubmit,
  isSubmitting,
}: PermissionAssignActionDialogProps) {
  const form = useForm<PermissionAssignActionFormValues>({
    resolver: zodResolver(permissionAssignActionFormSchema),
    defaultValues: {
      permissionIds: action?.policies.map((a) => a.permissionId) || [],
    },
  });

  const { data } = usePermissionsQuery();
  const [inputValue, setInputValue] = useState('');
  const [openPopover, setOpenPopover] = useState(false);
  const [removedBasePermissions, setRemovedBasePermissions] = useState<
    string[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const permissions = data?.data || [];

  const handleSubmit = async (values: PermissionAssignActionFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  useEffect(() => {
    if (action) {
      form.reset({
        permissionIds: action?.policies.map((a) => a.permissionId) || [],
      });
    }
  }, [action]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Permissions to Action</DialogTitle>
          <DialogDescription>
            Search and select permissions to assign to this action.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="text-sm text-muted-foreground">
              Action ID:{' '}
              <span className="font-medium text-foreground">{action?.id}</span>
            </div>

            <FormField
              control={form.control}
              name="permissionIds"
              render={({ field }) => {
                const selectedIds = [
                  ...(field.value ?? []),
                  ...(action?.policies
                    .map((p) => p.permissionId)
                    .filter((id) => !removedBasePermissions.includes(id)) ??
                    []),
                ];

                const selectedPermissions =
                  permissions?.filter((p) => selectedIds.includes(p.id)) || [];

                const filteredSuggestions =
                  permissions?.filter(
                    (p) =>
                      p.name.toLowerCase().includes(inputValue.toLowerCase()) &&
                      !selectedIds.includes(p.id)
                  ) || [];

                const addPermission = (id: string) => {
                  field.onChange([...field.value, id]);
                  setInputValue('');
                  inputRef.current?.focus();
                };

                const removePermission = (id: string) => {
                  if (action?.policies.some((p) => p.permissionId === id)) {
                    setRemovedBasePermissions((prev) => [...prev, id]);
                  }
                  field.onChange(
                    field.value?.filter((pid) => pid !== id) ?? []
                  );
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
                              setOpenPopover(true);
                            }}
                            onBlur={() => {
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
                                if (!found && filteredSuggestions.length == 0) {
                                  toast.error('Permission not found');
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
                {isSubmitting ? 'Assigning' : 'Assign Permissions'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default PermissionAssignActionDialog;
