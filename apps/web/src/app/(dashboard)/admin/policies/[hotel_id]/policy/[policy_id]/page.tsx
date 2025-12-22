'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  usePolicyQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  createPolicySchema,
  updatePolicySchema,
  CreatePolicyFormValues,
  UpdatePolicyFormValues,
  PolicyType,
} from '@/features/policies';
import { useEffect } from 'react';

const POLICY_TYPE_OPTIONS: { value: PolicyType; label: string; description: string }[] = [
  { value: 'CHECKIN', label: 'Check-in', description: 'Check-in and check-out policies' },
  { value: 'CANCELLATION', label: 'Cancellation', description: 'Cancellation and refund policies' },
  { value: 'PAYMENT', label: 'Payment', description: 'Payment methods and terms' },
  { value: 'CHILDREN', label: 'Children', description: 'Children and extra bed policies' },
  { value: 'PET', label: 'Pet', description: 'Pet policies' },
  { value: 'SMOKING', label: 'Smoking', description: 'Smoking policies' },
  { value: 'GENERAL', label: 'General', description: 'General hotel policies' },
];

export default function PolicyFormPage() {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.hotel_id as string;
  const policyId = params.policy_id as string;
  const isNew = policyId === 'new';

  const { data: policy, isLoading } = usePolicyQuery(hotelId, policyId);
  const createMutation = useCreatePolicyMutation(hotelId);
  const updateMutation = useUpdatePolicyMutation(hotelId, policyId);

  const form = useForm<CreatePolicyFormValues | UpdatePolicyFormValues>({
    resolver: zodResolver(isNew ? createPolicySchema : updatePolicySchema),
    defaultValues: {
      type: 'GENERAL',
      title: '',
      content: '',
      enabled: true,
      order: 0,
    },
  });
  useEffect(() => {
    if (policy && !isNew) {
      form.reset({
        type: policy.type,
        title: policy.title,
        content: policy.content,
        enabled: policy.enabled,
        order: policy.order,
      });
    }
  }, [policy, isNew, form]);

  const onSubmit = async (data: CreatePolicyFormValues | UpdatePolicyFormValues) => {
    try {
      if (isNew) {
        await createMutation.mutateAsync(data as CreatePolicyFormValues);
      } else {
        await updateMutation.mutateAsync(data as UpdatePolicyFormValues);
      }
      router.push(`/admin/policies/${hotelId}`);
    } catch (error) {
      console.error('Failed to save policy:', error);
    }
  };

  if (isLoading && !isNew) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push(`/admin/policies/${hotelId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Policies
        </Button>
        <h1 className="text-3xl font-bold">
          {isNew ? 'Create Policy' : 'Edit Policy'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isNew ? 'Add a new policy for this hotel' : 'Update policy information'}
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Information</CardTitle>
          <CardDescription>
            Fill in the details for the hotel policy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POLICY_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {option.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Check-in Time" {...field} />
                    </FormControl>
                    <FormDescription>
                      A short, descriptive title for this policy
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the policy details..."
                        rows={8}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed description of the policy
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enabled</FormLabel>
                        <FormDescription>
                          Show this policy to customers
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

                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Order</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Lower numbers appear first
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Saving...' : isNew ? 'Create Policy' : 'Update Policy'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/policies/${hotelId}`)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
