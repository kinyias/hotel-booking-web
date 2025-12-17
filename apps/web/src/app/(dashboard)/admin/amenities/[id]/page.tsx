"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import IconExplorer from "@/components/common/IconExplorer";
import { useGetAmenityByIdQuery } from "@/features/amentites/queries";
import {
  useCreateAmenityMutation,
  useUpdateAmenityMutation,
} from "@/features/amentites/mutations";
import { amenityFormSchema, AmenityFormSchema } from "@/features/amentites/validator";

export default function AmenityPage() {
  const params = useParams();
  const id = params.id as string;
  const isEditing = id !== "new";
  const router = useRouter();

  const { data: amenity, isLoading: isLoadingAmenity } = useGetAmenityByIdQuery(id, isEditing);
  const createMutation = useCreateAmenityMutation();
  const updateMutation = useUpdateAmenityMutation(id);

  const form = useForm<AmenityFormSchema>({
    resolver: zodResolver(amenityFormSchema),
    defaultValues: {
      label: "",
      key: "",
    },
  });

  useEffect(() => {
    if (amenity) {
      form.reset({
        label: amenity.label,
        key: amenity.key,
      });
    }
  }, [amenity, form]);

  const onSubmit = (data: AmenityFormSchema) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = isLoadingAmenity && isEditing;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Amenity" : "Create Amenity"}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input placeholder="Wifi, Pool, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon Key</FormLabel>
                <FormControl>
                    <div className="space-y-4">
                        <Input placeholder="Select an icon below" {...field} readOnly />
                        <div className="flex justify-end gap-4">
                            <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSaving}
                            >
                            Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {isEditing ? "Update" : "Create"}
                            </Button>
                        </div>
                        <IconExplorer 
                            onSelect={(icon) => form.setValue("key", icon)} 
                            selectedIcon={field.value}
                        />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </form>
      </Form>
    </div>
  );
}
