'use client';

import Link from 'next/link';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';
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
import { Promotion } from '../types';
import { useDeletePromotionMutation } from '../mutations';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PromotionTableProps {
  promotions: Promotion[];
}

export default function PromotionTable({ promotions }: PromotionTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeletePromotionMutation();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(parseFloat(value));
  };

  return (
    <>
      <Card className="bg-card border-border overflow-hidden w-full">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="text-foreground">Code</TableHead>
                <TableHead className="text-foreground">Name</TableHead>
                <TableHead className="text-foreground">Discount</TableHead>
                <TableHead className="text-foreground">Usage</TableHead>
                <TableHead className="text-foreground">Valid Period</TableHead>
                {/* <TableHead className="text-foreground">Hotel</TableHead> */}
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-right text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promotion) => {
                const now = new Date();
                const startDate = new Date(promotion.startAt);
                const endDate = new Date(promotion.endAt);
                const isExpired = now > endDate;
                const isNotStarted = now < startDate;
                const isActive = promotion.isActive && !isExpired && !isNotStarted;

                return (
                  <TableRow
                    key={promotion.id}
                    className="border-b border-border hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell className="text-foreground font-mono font-semibold">
                      {promotion.code}
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="font-medium">{promotion.name}</div>
                      {promotion.description && (
                        <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                          {promotion.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="font-medium">
                        {promotion.discountType === 'PERCENT'
                          ? `${promotion.discountValue}%`
                          : formatCurrency(promotion.discountValue.toString())}
                      </div>
                      {promotion.maxDiscountAmount && (
                        <div className="text-xs text-muted-foreground">
                          Max: {formatCurrency(promotion.maxDiscountAmount)}
                        </div>
                      )}
                      {promotion.minBookingAmount && (
                        <div className="text-xs text-muted-foreground">
                          Min: {formatCurrency(promotion.minBookingAmount)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="text-sm">
                        {promotion.usedCount}
                        {promotion.totalUsageLimit && ` / ${promotion.totalUsageLimit}`}
                      </div>
                      {promotion.perUserLimit && (
                        <div className="text-xs text-muted-foreground">
                          {promotion.perUserLimit} per user
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="text-sm">
                        {format(startDate, 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm">
                        {format(endDate, 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    {/* <TableCell className="text-muted-foreground">
                      {promotion.hotel ? (
                        <div className="text-sm">{promotion.hotel.name}</div>
                      ) : (
                        <Badge variant="outline">Global</Badge>
                      )}
                    </TableCell> */}
                    <TableCell>
                      {isActive ? (
                        <Badge variant="default" className="bg-green-600">Active</Badge>
                      ) : isExpired ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : isNotStarted ? (
                        <Badge variant="secondary">Scheduled</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/promotions/${promotion.id}`}>
                          <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {promotions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No promotions found</p>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the promotion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
