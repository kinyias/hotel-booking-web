'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { PromotionTypeTable } from '@/features/promotion/components/PromotionTypeTable';
import { PromotionType } from '@/features/promotion/types';
import Link from 'next/link';

// Mock Data
const MOCK_PROMOTION_TYPES: PromotionType[] = [
  { id: 't1', name: 'Seasonal', description: 'Seasonal promotions', status: 'ACTIVE' },
  { id: 't2', name: 'Flash Deal', description: 'Limited time offers', status: 'ACTIVE' },
  { id: 't3', name: 'New Year', description: 'New Year specials', status: 'INACTIVE' },
  { id: 't4', name: 'Early Bird', description: 'Advance booking discounts', status: 'ACTIVE' },
];

export default function PromotionTypesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredTypes = useMemo(() => {
        return MOCK_PROMOTION_TYPES.filter(type => {
            const matchesSearch = 
              type.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              type.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || type.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter]);

    return (
        <div className="m-4 md:m-6 space-y-6">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Promotion Types Management</h1>
                <Link href="/admin/promotions/types/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus size={20} className="mr-2" />
                  Add Type
                </Button>
                </Link>
              </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input 
                        placeholder="Search by name or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:max-w-xs"
                    />
                </div>
                <div className="w-full md:w-[200px] flex justify-end">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>

            <PromotionTypeTable promotions={filteredTypes} />
        </div>
    );
}
