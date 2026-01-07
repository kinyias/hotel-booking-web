'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Trash2, Search } from 'lucide-react';
import { Room } from '../types';
import Link from 'next/link';
import { useMutationDeleteRoom } from '../mutations';
import { ConfirmDialog } from '@/components/common/CofirmDialog';
import toast from 'react-hot-toast';

interface RoomTableProps {
  rooms: Room[];
  hotelId?: string;
  roomTypeId?: string;
}

export function RoomTable({ rooms, hotelId, roomTypeId }: RoomTableProps) {
  const [searchNumber, setSearchNumber] = useState('');
  const [searchFloor, setSearchFloor] = useState('');
  const [searchStatus, setSearchStatus] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const deleteMutation = useMutationDeleteRoom(hotelId || '');

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Room deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete room");
    } finally {
      setDeleteId(null);
    }
  };

  // ... (filtering logic same as before)
  const filteredRooms = rooms.filter((room) => {
    const matchesNumber = room.code.toLowerCase().includes(searchNumber.toLowerCase());
    const matchesFloor = searchFloor ? (room.floor || '').toString() === searchFloor : true;
    const matchesStatus = searchStatus !== 'all' ? room.status === searchStatus : true;
    return matchesNumber && matchesFloor && matchesStatus;
  });

  return (
    <>
      <Card className="bg-card border-border overflow-hidden mt-6">
          <CardHeader>
              <CardTitle>Rooms List</CardTitle>
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="relative flex-1 max-w-sm w-full">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                          placeholder="Search by room code..."
                          className="pl-8"
                          value={searchNumber}
                          onChange={(e) => setSearchNumber(e.target.value)}
                      />
                  </div>
                   <div className="w-full md:w-[150px]">
                      <Input
                          type="text"
                          placeholder="Filter by floor..."
                          value={searchFloor}
                          onChange={(e) => setSearchFloor(e.target.value)}
                      />
                  </div>
                  <Select value={searchStatus} onValueChange={setSearchStatus}>
                      <SelectTrigger className="w-full md:w-[150px]">
                          <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
          </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="text-foreground">Room Code</TableHead>
                  <TableHead className="text-foreground">Floor</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Clean Status</TableHead>
                  <TableHead className="text-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id} className="border-b border-border hover:bg-secondary/20">
                    <TableCell className="font-medium">{room.code}</TableCell>
                    <TableCell>{room.floor || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          room.status === 'ACTIVE'
                            ? 'default'
                            : room.status === 'MAINTENANCE'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          room.cleanStatus === 'CLEAN'
                            ? 'default'
                            : room.cleanStatus === 'DIRTY'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {room.cleanStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {hotelId && (roomTypeId || room.roomTypeId) ? (
                            <Link href={`/admin/room-types/${room.hotelId}/manage/${room.roomTypeId || room.roomTypeId}/room/${room.id}`}>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                          <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                              <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                          onClick={() => setDeleteId(room.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRooms.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">No rooms found</p>
              </div>
            )}
        </CardContent>
      </Card>
      
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Room"
        description="Are you sure you want to delete this room? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
