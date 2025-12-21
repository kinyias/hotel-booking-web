import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { RoomType } from '../types';
import Link from 'next/link';
import { formatNumber } from '@/utils/currency';
import { useState } from 'react';
import { useDeleteRoomTypeMutation } from '../mutations';
import { ConfirmDialog } from '@/components/common/CofirmDialog';
import toast from 'react-hot-toast';

interface RoomTypeTableProps {
  roomTypes: RoomType[];
  hotelId: string;
}

export function RoomTypeTable({ roomTypes, hotelId }: RoomTypeTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteRoomTypeMutation(hotelId);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Room Type deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete room type");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price/Night</TableHead>
              <TableHead>Max Guests</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomTypes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No room types found.
                </TableCell>
              </TableRow>
            ) : (
              roomTypes.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{formatNumber(room.price_per_night)}đ</TableCell>
                  <TableCell>{room.max_guests}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate" title={room.description}>
                    {room.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/room-types/${room.hotelId}/manage/${room.id}`}>
                      <Button variant="ghost" size="icon" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Room Type"
        description="Are you sure you want to delete this room type? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
