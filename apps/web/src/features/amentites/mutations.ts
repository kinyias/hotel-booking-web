import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAmentity, updateAmentity } from "./api";
import { AmenityFormSchema } from "./validator";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useCreateAmenityMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: createAmentity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['amenities'] });
            toast.success("Amenity created successfully");
            router.push("/admin/amenities");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create amenity");
        }
    });
};

export const useUpdateAmenityMutation = (id: string) => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: AmenityFormSchema) => updateAmentity(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['amenities'] });
            queryClient.invalidateQueries({ queryKey: ['amenity', id] });
            toast.success("Amenity updated successfully");
            router.push("/admin/amenities");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update amenity");
        }
    });
};