'use client';

import { useState } from 'react';
import { useDeactivateCommissionPackageMutation } from '@/features/commissions/mutations';
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
import { Edit, Ban } from 'lucide-react';
import { CommissionPackage } from '../types';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface CommissionPackageTableProps {
  packages: CommissionPackage[];
}

export default function CommissionPackageTable({
  packages,
}: CommissionPackageTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const deactivateMutation = useDeactivateCommissionPackageMutation();

  const handleDeactivateClick = (id: string) => {
    setSelectedPackageId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDeactivate = () => {
    if (selectedPackageId) {
      deactivateMutation.mutate(selectedPackageId, {
        onSuccess: () => {
          toast.success('Commission package deactivated successfully');
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              'Failed to deactivate commission package'
          );
        },
      });
    }
    setConfirmOpen(false);
    setSelectedPackageId(null);
  };

  const formatPercentage = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  return (
    <>
      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="text-foreground">Code</TableHead>
              <TableHead className="text-foreground">Name</TableHead>
              <TableHead className="text-foreground">Description</TableHead>
              <TableHead className="text-foreground">
                Commission Rate
              </TableHead>
              <TableHead className="text-foreground">Status</TableHead>
              <TableHead className="text-right text-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow
                key={pkg.id}
                className="border-b border-border hover:bg-secondary/30 transition-colors"
              >
                <TableCell className="text-foreground font-medium">
                  {pkg.code}
                </TableCell>
                <TableCell className="text-foreground">{pkg.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {pkg.description || '-'}
                </TableCell>
                <TableCell className="text-foreground font-semibold">
                  {formatPercentage(pkg.commissionRate)}
                </TableCell>
                <TableCell>
                  <Badge variant={pkg.isActive ? 'default' : 'secondary'}>
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/commissions/${pkg.id}`}>
                      <Button variant="ghost" size="icon" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    {pkg.isActive && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Deactivate"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeactivateClick(pkg.id)}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {packages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              No commission packages found
            </p>
          </div>
        )}
      </Card>
      <ConfirmDialog
        open={confirmOpen}
        title="Deactivate Commission Package"
        description="Are you sure you want to deactivate this commission package? Hotels using this package will need to be reassigned."
        confirmText="Deactivate"
        cancelText="Cancel"
        isLoading={deactivateMutation.isPending}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
