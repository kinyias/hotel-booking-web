'use client';

import { useState } from 'react';
import { useDeleteHotelMutation } from '@/features/hotels/mutations';
import { ConfirmDialog } from '@/components/common/CofirmDialog';
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
import { Edit, Trash2 } from 'lucide-react';
import { Hotel } from '../types';
import Link from 'next/link';

interface HotelTableProps {
  hotels: Hotel[];
}

export default function HotelTable({ hotels }: HotelTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const deleteMutation = useDeleteHotelMutation();

  const handleDeleteClick = (id: string) => {
    setSelectedHotelId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedHotelId) {
      deleteMutation.mutate(selectedHotelId);
    }
    setConfirmOpen(false);
    setSelectedHotelId(null);
  };

  return (
    <>
      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="text-foreground">Image</TableHead>
              <TableHead className="text-foreground">Name</TableHead>
              <TableHead className="text-foreground">Email Owner</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-right text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel, index) => {
              const firstImage = hotel.images?.[0]?.url;
              return (
                <TableRow
                  key={index}
                  className="border-b border-border hover:bg-secondary/30 transition-colors"
                >
                  <TableCell>
                    {firstImage ? (
                      <img
                        src={firstImage}
                        alt={hotel.name}
                        className="h-12 w-12 object-cover rounded-md border border-border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-secondary border border-border" />
                    )}
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    {hotel.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {hotel.owner.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        hotel.status === 'ACTIVE' ? 'default' : 'secondary'
                      }
                    >
                      {hotel.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/hotels/${hotel.id}`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(hotel.id)}
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

        {hotels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No hotels found</p>
          </div>
        )}
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Hotel"
        description="Are you sure you want to delete this hotel? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
