'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/common/CofirmDialog';
import { News } from '../types';
import { useDeleteNewsMutation } from '../mutations';

interface NewsTableProps {
  news: News[];
}

export default function NewsTable({ news }: NewsTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const deleteMutation = useDeleteNewsMutation();

  const handleDeleteClick = (item: News) => {
    setSelectedNews(item);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedNews) {
      deleteMutation.mutate(selectedNews.id, {
        onSuccess: () => {
          toast.success('News deleted successfully');
          setConfirmOpen(false);
          setSelectedNews(null);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to delete news');
          setConfirmOpen(false); // Close dialog on error too or keep it open? Usually close or show error.
        },
      });
    }
  };

  return (
    <>
      <Card className="bg-card border-border overflow-hidden w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="text-foreground">Image</TableHead>
              <TableHead className="text-foreground">Title</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-foreground">Published At</TableHead>
              <TableHead className="text-foreground">Created At</TableHead>
              <TableHead className="text-right text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item) => {
              const firstImage = item.images?.[0]?.url;
              return (
                <TableRow
                  key={item.id}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <TableCell>
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={item.title}
                        className="h-12 w-12 object-cover rounded-md border border-border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-secondary border border-border" />
                    )}
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    {item.title}
                    <div className="text-xs text-muted-foreground">{item.slug}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'PUBLISHED'
                          ? 'default'
                          : item.status === 'ARCHIVED'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/news/${item.id}`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {news.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No news found</p>
          </div>
        )}
      </Card>
      
      <ConfirmDialog
        open={confirmOpen}
        title="Delete News"
        description="Are you sure you want to delete this news? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
