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
import { Promotion } from '../types';
import Link from 'next/link';

interface PromotionTableProps {
    promotions: Promotion[];
}

export function PromotionTable({
    promotions
}: PromotionTableProps) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                         <TableHead>Title</TableHead>
                         <TableHead>Type</TableHead>
                         <TableHead>Discount</TableHead>
                         <TableHead>Duration</TableHead>
                         <TableHead>Status</TableHead>
                         <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {promotions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No promotions found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        promotions.map((promo) => (
                            <TableRow key={promo.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{promo.title}</span>
                                        <span className="text-xs text-muted-foreground truncate max-w-[200px]" title={promo.description}>{promo.description}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{promo.type.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {promo.discount_type === 'PERCENTAGE' 
                                            ? `${promo.discount_value}%` 
                                            : `$${promo.discount_value}`
                                        }
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col text-sm">
                                        <span className="whitespace-nowrap">{new Date(promo.start_date).toLocaleDateString()}</span>
                                        <span className="text-muted-foreground text-xs whitespace-nowrap">to {new Date(promo.end_date).toLocaleDateString()}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={
                                        promo.status === 'ACTIVE' ? 'success' : 
                                        promo.status === 'EXPIRED' ? 'destructive' : 
                                        promo.status === 'DRAFT' ? 'secondary' : 'default'
                                    }>
                                        {promo.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/promotions/${promo.id}`}>
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
