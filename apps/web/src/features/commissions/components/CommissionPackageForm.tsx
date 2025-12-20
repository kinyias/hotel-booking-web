'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  commissionPackageSchema,
  CommissionPackageFormValues,
} from '../validator';
import { CommissionPackage } from '../types';

interface CommissionPackageFormProps {
  commissionPackage?: CommissionPackage | null;
  onSubmit: (data: CommissionPackageFormValues) => Promise<void>;
  isLoading?: boolean;
}

export default function CommissionPackageForm({
  commissionPackage,
  onSubmit,
  isLoading = false,
}: CommissionPackageFormProps) {
  const form = useForm<CommissionPackageFormValues>({
    resolver: zodResolver(commissionPackageSchema),
    defaultValues: {
      code: commissionPackage?.code || '',
      name: commissionPackage?.name || '',
      description: commissionPackage?.description || '',
      commissionRate: commissionPackage?.commissionRate || 0,
      isActive: commissionPackage?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (commissionPackage) {
      form.reset({
        code: commissionPackage.code,
        name: commissionPackage.name,
        description: commissionPackage.description || '',
        commissionRate: commissionPackage.commissionRate,
        isActive: commissionPackage.isActive,
      });
    }
  }, [commissionPackage, form]);

  const handleSubmit = async (data: CommissionPackageFormValues) => {
    await onSubmit(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {commissionPackage
            ? 'Edit Commission Package'
            : 'Create Commission Package'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., STANDARD, PREMIUM"
                      disabled={!!commissionPackage}
                    />
                  </FormControl>
                  <FormDescription>
                    Unique identifier for this commission package. Cannot be
                    changed after creation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Standard Package, Premium Package"
                    />
                  </FormControl>
                  <FormDescription>
                    Display name for this commission package
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe this commission package..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commission Rate</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        placeholder="0.10"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                      <span className="text-muted-foreground">
                        ({((field.value || 0) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter as decimal (e.g., 0.10 for 10%, 0.15 for 15%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Inactive packages cannot be assigned to new hotels
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'Saving...'
                  : commissionPackage
                  ? 'Update Package'
                  : 'Create Package'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
