'use client';

import Image from 'next/image';
import { useGetImagesInFolderGalleryQuery } from '@/features/gallery/queries';
import { Loader2 } from 'lucide-react';

interface GalleryImagesProps {
  folderId?: string | null;
  selectedIds: Set<string>;
  onToggle: (image: { id: string; url: string }) => void;
}

export default function GalleryImages({
  folderId,
  selectedIds,
  onToggle,
}: GalleryImagesProps) {
  const { data: images, isLoading } = useGetImagesInFolderGalleryQuery(folderId || '');

  if (!folderId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <p>Select a folder to view images</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images?.map((img) => {
          const selected = selectedIds.has(img.id);
          const displayUrl = img.secureUrl || img.url;
          return (
            <button
              key={img.id}
              type="button"
              className={`group relative aspect-square border rounded-md overflow-hidden bg-muted cursor-pointer ${
                selected
                  ? 'border-primary ring-2 ring-primary/40'
                  : 'border-border'
              }`}
              onClick={() => onToggle({ id: img.id, url: displayUrl })}
            >
              <Image
                src={displayUrl}
                alt="Gallery image"
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
              {selected && (
                <div className="absolute inset-0 bg-primary/20 pointer-events-none flex items-center justify-center">
                    <div className="bg-primary text-white text-xs px-2 py-1 rounded shadow-sm">Selected</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {images?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
          <p>No images in this folder.</p>
        </div>
      )}
    </div>
  );
}
