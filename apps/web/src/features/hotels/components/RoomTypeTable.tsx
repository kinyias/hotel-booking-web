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

interface RoomTypeTableProps {
  roomTypes: RoomType[];
}

export function RoomTypeTable({ roomTypes }: RoomTypeTableProps) {
  return (
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
              <TableRow key={room.type_id}>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>${room.price_per_night}</TableCell>
                <TableCell>{room.max_guests}</TableCell>
                <TableCell className="hidden md:table-cell max-w-xs truncate" title={room.description}>
                  {room.description}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/hotels/${room.type_id}/room-types/${room.type_id}`}>
                    <Button variant="ghost" size="icon" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
  );
}
