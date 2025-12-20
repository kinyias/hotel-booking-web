'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Calendar, ArrowRight, Search } from 'lucide-react';
import { usePublicNewsListQuery } from '@/features/news/queries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import PageTitle from '@/components/sections/PageTitle';
import EllipsisPagination from '@/components/ui/EllipsisPagination';
import { useDebounce } from '@/hooks/useDebounce';

function NewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Number(searchParams.get('page')) || 1;
  const q = searchParams.get('q') || '';
  const limit = 9; // Display 9 items per page

  const [searchTerm, setSearchTerm] = useState(q);
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  // Sync searchTerm with URL when URL changes explicitly (e.g. back button)
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const { data, isLoading, isError } = usePublicNewsListQuery({
    page,
    limit,
    q,
  });

  const newsItems = data?.items || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Debounce is handled manually here or inside input if complex. 
    // To keep simple, we'll search on Enter or allow user to click search button, 
    // but for "filter" feel, usually it's live type. 
    // Let's implement simple debounce effect:
  };

  // Debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch !== q) {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearch) {
          params.set('q', debouncedSearch);
        } else {
          params.delete('q');
        }
        params.set('page', '1'); // Reset to page 1 on search
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedSearch, q, router, pathname, searchParams]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
           <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden border-none shadow-lg h-full flex flex-col">
               <Skeleton className="h-48 w-full" />
               <CardContent className="flex-grow p-6 space-y-4">
                 <Skeleton className="h-6 w-3/4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-2/3" />
               </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold text-destructive">Unable to load news</h2>
        <p className="text-muted-foreground mt-2">Please try again later.</p>
        <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
        >
            Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">Latest Articles</h2>
            <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search articles..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
        </div>

        {/* News Grid */}
        {newsItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {newsItems.map((news) => {
                    const coverImage = news.images?.[0]?.url || '/placeholder-news.jpg';
                    return (
                    <Link href={`/news/${news.slug}`} key={news.id} className="group">
                        <Card className="h-full flex flex-col overflow-hidden border border-border/50 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
                        <div className="relative h-56 w-full overflow-hidden">
                            {news.images?.[0] ? (
                                <Image
                                src={coverImage}
                                alt={news.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">
                                News
                                </Badge>
                            </div>
                        </div>
                        
                        <CardHeader className="p-6 pb-2">
                            <div className="flex items-center text-sm text-muted-foreground mb-3 gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {news.publishedAt
                                ? new Date(news.publishedAt).toLocaleDateString(undefined, {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    })
                                : 'Draft'}
                            </span>
                            </div>
                            <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {news.title}
                            </h3>
                        </CardHeader>
                        
                        <CardContent className="p-6 pt-2 flex-grow">
                            <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                            {news.summary || 'No summary available.'}
                            </p>
                        </CardContent>

                        <CardFooter className="p-6 pt-0 mt-auto">
                            <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                Read Article <ArrowRight className="h-4 w-4" />
                            </span>
                        </CardFooter>
                        </Card>
                    </Link>
                    );
                })}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <EllipsisPagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-secondary/20 rounded-lg">
             <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
             </div>
             <h3 className="text-xl font-medium text-muted-foreground">No news articles found.</h3>
             <p className="text-muted-foreground mt-2">Try adjusting your search terms.</p>
             {q && (
                <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => handleSearch('')}
                >
                    Clear search
                </Button>
             )}
          </div>
        )}
    </div>
  );
}

export default function PublicNewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageTitle
        title="News & Articles"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'News & Articles', href: '/news' },
        ]}
        description="Stay updated with the latest trends, announcements, and stories from our hotels and destinations."
      />
      <Suspense fallback={<div className="container mx-auto py-12 px-4 text-center">Loading...</div>}>
        <NewsContent />
      </Suspense>
    </div>
  );
}
