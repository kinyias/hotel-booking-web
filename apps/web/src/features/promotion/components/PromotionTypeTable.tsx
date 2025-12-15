import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { PromotionType } from '../types';
import Link from 'next/link';

interface PromotionTypeTableProps {
    promotions: PromotionType[]; // Actually Promotion Types
}

export function PromotionTypeTable({
    promotions
}: PromotionTypeTableProps) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                         <TableHead>Type ID</TableHead>
                         <TableHead>Name</TableHead>
                         <TableHead>Description</TableHead>
                         <TableHead>Status</TableHead>
                         <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {promotions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No promotion types found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        promotions.map((promo) => (
                            <TableRow key={promo.id}>
                                <TableCell className="font-medium">
                                    {promo.id}
                                </TableCell>
                                <TableCell>{promo.name}</TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground truncate max-w-[300px] block" title={promo.description}>
                                      {promo.description}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        promo.status === 'ACTIVE' ? 'success' : 
                                        'destructive'
                                    }>
                                        {promo.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/promotions/types/${promo.id}`}>
                                            <Button variant="ghost" size="icon" title="Edit">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
