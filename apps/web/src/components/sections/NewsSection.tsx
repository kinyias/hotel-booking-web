'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePublicNewsListQuery } from '@/features/news/queries';

function NewsSection() {
  const { data: newsData } = usePublicNewsListQuery({ limit: 3 });

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-balance">
            News & Events
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsData?.items.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <Link href={`/news/${item.slug}`}>
                <Image
                  src={item.images?.[0]?.url || '/placeholder.svg'}
                  alt={item.title}
                  className="w-full h-58 object-cover"
                  width={500}
                  height={80}
                />
              </Link>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ''}
                </p>
                <Link href={`/news/${item.slug}`}>
                  <h3 className="font-serif text-xl font-bold mb-3 text-foreground hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsSection;
