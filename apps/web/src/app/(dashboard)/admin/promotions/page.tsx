'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  PromotionFilters,
  PromotionTable,
  Promotion,
} from '@/features/promotion';
import Link from 'next/link';
// Mock Data
const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    hotel_id: "1",
    type: { id: 't1', name: 'Seasonal', description: 'Seasonal promotions', status: 'ACTIVE' },
    title: 'Summer Sale',
    description: 'Get 20% off on all summer bookings',
    discount_type: 'PERCENTAGE',
    discount_value: 20,
    start_date: '2025-06-01',
    end_date: '2025-08-31',
    status: 'ACTIVE',
  },
  {
    id: '2',
hotel_id: "1",
    type: { id: 't2', name: 'Flash Deal', description: 'Limited time offers', status: 'ACTIVE' },
    title: 'Weekend Getaway',
    description: 'Special price for weekend stays',
    discount_type: 'FIXED_AMOUNT',
    discount_value: 50,
    start_date: '2025-05-10',
    end_date: '2025-05-12',
    status: 'EXPIRED',
  },
  {
    id: '3',
    hotel_id: "1",
    type: { id: 't3', name: 'New Year', description: 'New Year specials', status: 'INACTIVE' },
    title: 'Welcome 2026',
    description: 'Celebrate New Year with us',
    discount_type: 'PERCENTAGE',
    discount_value: 15,
    start_date: '2025-12-25',
    end_date: '2026-01-05',
    status: 'DRAFT',
  },
  {
    id: '4',
    hotel_id: "1",
    type: { id: 't1', name: 'Seasonal', description: 'Seasonal promotions', status: 'ACTIVE' },
    title: 'Winter Warmup',
    description: 'Cozy stays for winter',
    discount_type: 'PERCENTAGE',
    discount_value: 10,
    start_date: '2025-11-01',
    end_date: '2026-02-28',
    status: 'INACTIVE',
  },
  {
    id: '5',
    hotel_id: "1",
    type: { id: 't4', name: 'Early Bird', description: 'Advance booking discounts', status: 'ACTIVE' },
    title: 'Book Early Save More',
    description: 'Book 3 months in advance and save',
    discount_type: 'PERCENTAGE',
    discount_value: 25,
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    status: 'ACTIVE',
  }
];

export default function PromotionsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [discountTypeFilter, setDiscountTypeFilter] = useState<string>('all');

    const filteredPromotions = useMemo(() => {
        return MOCK_PROMOTIONS.filter(promo => {
            const matchesSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || promo.status === statusFilter;
            const matchesDiscountType = discountTypeFilter === 'all' || promo.discount_type === discountTypeFilter;
            
            return matchesSearch && matchesStatus && matchesDiscountType;
        });
    }, [searchTerm, statusFilter, discountTypeFilter]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setDiscountTypeFilter('all');
    };

    return (
        <div className="m-4 md:m-6 space-y-6">
             <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Promotions Management</h1>
                <Link href="/admin/promotions/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus size={20} className="mr-2" />
                  Add Promotion
                </Button>
                </Link>
              </div>

            <PromotionFilters 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                discountTypeFilter={discountTypeFilter}
                onDiscountTypeFilterChange={setDiscountTypeFilter}
                onReset={handleResetFilters}
            />

            <PromotionTable promotions={filteredPromotions} />
        </div>
    );
}
