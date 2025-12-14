import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscountType, PromotionStatus } from '../types';

interface PromotionFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  discountTypeFilter: string;
  onDiscountTypeFilterChange: (val: string) => void;
  onReset: () => void;
}

export function PromotionFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    discountTypeFilter,
    onDiscountTypeFilterChange,
    onReset
}: PromotionFiltersProps) {
    return (
        <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                 <div className="relative flex-1 w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                         <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="EXPIRED">Expired</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select value={discountTypeFilter} onValueChange={onDiscountTypeFilterChange}>
                         <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Discount Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                            <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={onReset} title="Reset Filters">
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}
