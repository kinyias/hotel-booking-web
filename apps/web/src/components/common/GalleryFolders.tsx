'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGetFoldersGalleryQuery } from '@/features/gallery/queries';
import { useCreateFolderGalleryMutation } from '@/features/gallery/mutations';
import { GalleryFolders as GalleryFolderType } from '@/features/gallery/types';
import { Folder as FolderIcon, FolderPlus, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GalleryFoldersProps {
  selectedFolderId?: string | null;
  onSelect: (folder: GalleryFolderType) => void;
}

export default function GalleryFolders({
  selectedFolderId,
  onSelect,
}: GalleryFoldersProps) {
  const { data: folders, isLoading } = useGetFoldersGalleryQuery();
  const createFolderMutation = useCreateFolderGalleryMutation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;
    
    createFolderMutation.mutate(
      { folderName: newFolderName },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
          setNewFolderName('');
        },
      }
    );
  };

  return (
    <>
      <div className="flex flex-col h-full border-r bg-muted/10">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <FolderIcon className="w-4 h-4" />
            Folders
          </h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCreateOpen(true)}>
            <FolderPlus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {isLoading && (
              <div className="p-4 text-xs text-center text-muted-foreground">
                Loading folders...
              </div>
            )}
            
            {!isLoading && folders?.length === 0 && (
              <div className="p-4 text-xs text-center text-muted-foreground">
                No folders found.
              </div>
            )}

            {folders?.map((f) => {
              const selected = selectedFolderId === f.id;
              return (
                <Button
                  key={f.id}
                  variant={selected ? "secondary" : "ghost"}
                  className={`w-full justify-start text-sm font-normal ${selected ? 'bg-secondary text-secondary-foreground' : ''}`}
                  onClick={() => onSelect(f)}
                >
                  <FolderIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate flex-1 text-left">{f.folderName}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {f._count?.galleries ?? 0}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Folder Name</Label>
              <Input 
                placeholder="Enter folder name..." 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                    if(e.key === 'Enter') handleCreate();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createFolderMutation.isPending || !newFolderName.trim()}>
              {createFolderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
