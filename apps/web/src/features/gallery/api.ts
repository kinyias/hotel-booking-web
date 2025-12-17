import { API_ENDPOINTS } from "@/constants";
import api from "@/lib/axios";
import { GalleryFolders, GalleryImages } from "./types";

export const getFoldersGallery = async () =>{
     const response = await api.get<GalleryFolders[]>(
    API_ENDPOINTS.GALLERY.FOLDERS,
  );
  return response.data;
}

export const getImagesInFolderGallery = async (folderId: string) => {
    const response = await api.get<GalleryImages[]>(
        `${API_ENDPOINTS.GALLERY.FOLDERS}/${folderId}/images`,
    );
    return response.data;
}

export const createFolderGallery = async (folderName: string) => {
    const response = await api.post<GalleryFolders>(
        API_ENDPOINTS.GALLERY.CREATE_FOLDER,
        { folderName },
    );
    return response.data;
}