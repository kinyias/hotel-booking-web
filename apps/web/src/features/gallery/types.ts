export interface GalleryFolders {
    id: string;
    folderName: string;
    userId: string;
    _count: {
        galleries: number;
    }
}

export interface GalleryImages {
    id: string;
    publicId: string;
    url: string;
    secureUrl: string;
    createdAt: string;
    updatedAt: string;
    folderId: string;
    userId: string;
}

