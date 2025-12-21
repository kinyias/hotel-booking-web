'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Banner } from '../types';
import { Edit, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useDeleteBannerMutation } from '../mutations';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BannerTableProps {
  banners: Banner[];
  onEdit: (banner: Banner) => void;
}

export function BannerTable({ banners, onEdit }: BannerTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const deleteMutation = useDeleteBannerMutation();

  const handleDeleteClick = (banner: Banner) => {
    setBannerToDelete(banner);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;

    try {
      await deleteMutation.mutateAsync(bannerToDelete.id);
      toast.success('Banner deleted successfully');
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete banner');
    }
  };

  const getLinkTypeColor = (linkType: string) => {
    switch (linkType) {
      case 'URL':
        return 'bg-blue-500/10 text-blue-500';
      case 'HOTEL':
        return 'bg-green-500/10 text-green-500';
      case 'NEWS':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (banners.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No banners</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new banner.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Pos</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Link Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell className="font-medium">{banner.position}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{banner.title || 'Untitled'}</div>
                    {banner.subtitle && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {banner.subtitle}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {banner.images.slice(0, 3).map((img, idx) => (
                      <div
                        key={img.id}
                        className="w-10 h-10 rounded border overflow-hidden bg-gray-100"
                      >
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23ddd" width="40" height="40"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    ))}
                    {banner.images.length > 3 && (
                      <div className="w-10 h-10 rounded border bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        +{banner.images.length - 3}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getLinkTypeColor(banner.linkType)}>
                    {banner.linkType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {banner.startAt && (
                      <div className="text-gray-600">
                        From: {format(new Date(banner.startAt), 'MMM dd, yyyy')}
                      </div>
                    )}
                    {banner.endAt && (
                      <div className="text-gray-600">
                        To: {format(new Date(banner.endAt), 'MMM dd, yyyy')}
                      </div>
                    )}
                    {!banner.startAt && !banner.endAt && (
                      <span className="text-gray-400">Always</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {banner.link && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(banner.link, '_blank')}
                        title="Open link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(banner)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{bannerToDelete?.title || 'this banner'}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
