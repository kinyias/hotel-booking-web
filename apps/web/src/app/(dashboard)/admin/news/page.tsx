'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import NewsTable from '@/features/news/components/NewsTable';
import { useNewsListQuery } from '@/features/news/queries';

export default function AdminNewsPage() {
  const { data, isLoading, isError } = useNewsListQuery({
    page: 1,
    limit: 100, // Fetch all for now or implement pagination later if needed
  });

  const news = data?.items || [];

  if (isLoading) {
    return <div className="p-6">Loading news...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-500">Error loading news.</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6 flex-col">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl font-bold tracking-tight">News Management</h1>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create News
          </Button>
        </Link>
      </div>

      <NewsTable news={news} />
    </div>
  );
}
