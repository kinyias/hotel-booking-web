'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { usePublicNewsDetailQuery } from '@/features/news/queries';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function PublicNewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  // We treat news_id as the slug
  const slug = params.news_id as string;

  const { data: news, isLoading, isError } = usePublicNewsDetailQuery(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
        <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (isError || !news) {
    return (
      <div className="container mx-auto py-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been removed.</p>
        <Link href="/news">
            <Button>Back to News</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background pb-20">
      {/* Header / Hero */}
      <div className="relative w-full h-[50vh] min-h-[400px] bg-secondary">
        {news.images?.[0] ? (
            <Image
            src={news.images[0].url}
            alt={news.title}
            fill
            className="object-cover"
            priority
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No Cover Image</span>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <div className="container mx-auto max-w-4xl">
                 <Link href="/news" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mb-6 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full transition-colors w-fit">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to News
                </Link>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 drop-shadow-sm">
                    {news.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
                        News
                    </Badge>
                     {news.publishedAt && (
                        <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-md backdrop-blur-sm">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={news.publishedAt}>
                                {new Date(news.publishedAt).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 w-full mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
                
                {/* Main Content */}
                <div className="space-y-8">
                     {/* Summary */}
                    {news.summary && (
                        <div className="text-xl md:text-2xl font-light text-muted-foreground leading-relaxed border-l-4 border-primary pl-6 py-2">
                            {news.summary}
                        </div>
                    )}

                    <Separator />

                    {/* Rich Text Content */}
                    <div 
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: news.content || '' }}
                    />
                </div>

                {/* Sidebar */}
                <aside className="space-y-8 lg:sticky lg:top-24 h-fit">
                     <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            Share this article
                        </h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full hover:bg-sky-50 hover:text-sky-500 hover:border-sky-200 transition-colors">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                        </div>
                     </div>

                    <div className="bg-primary/5 rounded-xl p-6">
                        <h3 className="font-semibold text-primary mb-2">Have a question?</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Contact our support team for more information about this announcement.
                        </p>
                        <Button className="w-full">Contact Us</Button>
                    </div>
                </aside>
            </div>
      </div>
    </article>
  );
}
