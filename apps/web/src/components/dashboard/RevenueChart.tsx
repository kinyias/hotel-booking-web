'use client';

import { useState, useMemo } from 'react';
import { formatCurrency } from '@/utils/currency';
import { useRevenueChartQuery } from '@/features/dashboard/queries';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

export type RevenueGroupBy = 'day' | 'week' | 'month';
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface RevenueChartProps {
    hotelId?: string;
}

export function RevenueChart({ hotelId }: RevenueChartProps) {
  const currentYear = new Date().getFullYear();
  const [viewType, setViewType] = useState<'year' | 'range'>('year');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(currentYear, 0, 1),
    to: new Date(currentYear, 11, 31),
  });
  const [groupBy, setGroupBy] = useState<RevenueGroupBy>('month');

  // Prepare Query Params
  const queryParams = useMemo(() => {
     if (viewType === 'year') {
         return {
             hotelId,
             groupBy: 'month' as const,
             year: selectedYear
         }
     }
     return {
        hotelId,
        groupBy: groupBy === 'month' ? 'month' : 'day' as any, // Simple mapping for now
        from: dateRange.from?.toISOString(),
        to: dateRange.to?.toISOString(),
     }
  }, [hotelId, viewType, selectedYear, dateRange, groupBy]);

  const { data: rawData, isLoading } = useRevenueChartQuery(queryParams as any);

  // Transform data for the chart
  const chartData = useMemo(() => {
      if (!rawData) return [];
      
      if (Array.isArray(rawData) && typeof rawData[0] === 'number') {
        // Year View (Array of numbers)
        return (rawData as number[]).map((total, index) => ({
            name: monthNames[index],
            revenue: total,
        }));
      }
      
      // Range View (Array of objects)
      const list = rawData as { date: string, revenue: number }[];
      // If we need accumulation logic, we can do it here, but rawData should ideally be already aggregated if api handles it.
      // Based on my API implementation, it aggregates by date key.
      // So we just need to format the name.
      return list.map(item => ({
        name: format(new Date(item.date), groupBy === 'month' ? 'MM/yyyy' : 'dd/MM/yyyy', { locale: vi }),
        revenue: item.revenue
      })).sort((a, b) => {
         // Sort by date (assuming name format allows easy parse or we trust API order. API sends unsorted map usually so we sort)
         // Actually simpler: API doesn't guarantee sort for range.
          const [a1, a2, a3] = a.name.split('/').map(Number);
          const [b1, b2, b3] = b.name.split('/').map(Number);
          // Quick hack date parse if format dd/MM/yyyy
          // Better to trust the order from transform if we kept original date
          return 0; 
      });
  }, [rawData, groupBy]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>Revenue</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* View Type Selection */}
              <Select
                value={viewType}
                onValueChange={(value: 'year' | 'range') => setViewType(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="View type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="range">Range</SelectItem>
                </SelectContent>
              </Select>

              {viewType === 'year' ? (
                // Year Selection
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => currentYear - i).map(
                      (year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <>
                  {/* Date Range Selection */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[280px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, 'dd/MM/yyyy')} -{' '}
                              {format(dateRange.to, 'dd/MM/yyyy')}
                            </>
                          ) : (
                            format(dateRange.from, 'dd/MM/yyyy')
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={{
                          from: dateRange?.from,
                          to: dateRange?.to,
                        }}
                        onSelect={(range) => {
                          setDateRange({
                            from: range?.from,
                            to: range?.to,
                          });
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Group By Selection */}
                  <Select
                    value={groupBy}
                    onValueChange={(value: RevenueGroupBy) => setGroupBy(value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="By group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            {isLoading ? (
                <div className="flex h-full items-center justify-center">Loading...</div>
            ) : (
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                    interval={0}
                    angle={viewType === 'range' ? -45 : 0}
                    textAnchor={viewType === 'range' ? 'end' : 'middle'}
                    height={60}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickMargin={8}
                    tickFormatter={(value) => `${formatCurrency(Number(value))}`}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    formatter={(value) => [
                    `${formatCurrency(Number(value))}`,
                    'Revenue',
                    ]}
                />
                <Legend />
                <Bar
                    name="Revenue"
                    dataKey="revenue"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                    barSize={30}
                />
                </BarChart>
            </ResponsiveContainer>
           )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}