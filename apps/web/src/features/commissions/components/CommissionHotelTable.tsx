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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Hotel } from '@/features/hotels/types';
import CommissionAssignToHotelDialog from './CommissionAssignToHotelDialog';

interface CommissionHotelTableProps {
  hotels: Hotel[];
}

export default function CommissionHotelTable({ hotels }: CommissionHotelTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const handleAssignClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setDialogOpen(true);
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
              <TableHead className="text-foreground">Commission Package</TableHead>
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
                  <TableCell>
                    {hotel.commissionPackage ? (
                      <div className="flex flex-col">
                        <span className="text-foreground font-medium">
                          {hotel.commissionPackage.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {hotel.commissionPackage.commissionRate * 100}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Not assigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Assign Commission Package"
                        onClick={() => handleAssignClick(hotel)}
                      >
                        <Settings className="h-4 w-4" />
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
      <CommissionAssignToHotelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        hotel={selectedHotel}
      />
    </>
  );
}
