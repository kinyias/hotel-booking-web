'use client';

import { useState } from 'react';
import { formatCurrency } from '@/utils/currency';
import { useQuery } from '@tanstack/react-query';
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
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];


export function RevenueChart() {
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

  // Query for yearly view (monthly data)
  const yearlyQuery = [0,0,0,0,0,588000,2256500,676500,0,0,0,0]
  const fromDateString = dateRange.from?.toISOString().split('T')[0] || null;
  const toDateString = dateRange.to?.toISOString().split('T')[0] || null;
  // Query for custom date range
  const rangeQuery = [
    {
        "date": "2025-06-14T14:10:16.685Z",
        "revenue": 588000
    },
    {
        "date": "2025-07-14T14:14:13.633Z",
        "revenue": 226500
    },
    {
        "date": "2025-07-14T14:47:28.305Z",
        "revenue": 916500
    },
    {
        "date": "2025-07-14T15:10:42.433Z",
        "revenue": 727000
    },
    {
        "date": "2025-07-14T15:12:11.008Z",
        "revenue": 386500
    },
    {
        "date": "2025-08-03T11:00:26.294Z",
        "revenue": 676500
    }
]

  // Transform data for the chart
  const chartData =
    viewType === 'year'
      ? yearlyQuery.map((total, index) => ({
          name: monthNames[index],
          revenue: total,
        })) || []
      : rangeQuery
          ?.reduce((acc, item) => {
            const formattedDate = format(
              new Date(item.date),
              groupBy === 'month' ? 'MM/yyyy' : 'dd/MM/yyyy',
              { locale: vi }
            );

            const existingItem = acc.find((i) => i.name === formattedDate);
            if (existingItem) {
              existingItem.revenue += item.revenue;
            } else {
              acc.push({
                name: formattedDate,
                revenue: item.revenue,
              });
            }
            return acc;
          }, [] as { name: string; revenue: number }[])
          .sort((a, b) => {
            const [aMonth, aYear] = a.name.split('/').reverse();
            const [bMonth, bYear] = b.name.split('/').reverse();
            const dateA = new Date(Number(aYear), Number(aMonth) - 1);
            const dateB = new Date(Number(bYear), Number(bMonth) - 1);
            return dateA.getTime() - dateB.getTime();
          }) || [];

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
                  <SelectItem value="range">Optional</SelectItem>
                </SelectContent>
              </Select>

              {viewType === 'year' ? (
                // Year Selection
                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Chọn năm" />
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
                          <span>Chọn khoảng thời gian</span>
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
          <ResponsiveContainer width="100%" height={400}>
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
        </CardContent>
      </Card>
    </>
  );
}