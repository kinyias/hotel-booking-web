import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolderGallery } from "./api";

export const useCreateFolderGalleryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { folderName: string }) => createFolderGallery(data.folderName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders-gallery'] });
        },
    });
};