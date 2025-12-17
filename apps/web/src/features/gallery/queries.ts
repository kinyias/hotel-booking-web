import { useQuery } from "@tanstack/react-query";
import { getFoldersGallery, getImagesInFolderGallery } from "./api";

export const useGetFoldersGalleryQuery = () => {
    return useQuery({
        queryKey: ['folders-gallery'],
        queryFn: () => getFoldersGallery(),
    })
}

export const useGetImagesInFolderGalleryQuery = (folderId: string) => {
    return useQuery({
        queryKey: ['images-gallery', folderId],
        queryFn: () => getImagesInFolderGallery(folderId),
        enabled: !!folderId,
    })
}

