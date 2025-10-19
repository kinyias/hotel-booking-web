import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function NewsSection() {
  const news = [
    {
      title: 'Ưu đãi mùa hè đặc biệt',
      date: '15 tháng 6, 2025',
      image: '/images/luxury-hotel-pool-area.jpg',
      excerpt:
        'Đặt phòng ngay hôm nay và tiết kiệm đến 30% cho kỳ nghỉ mùa hè của bạn.',
    },
    {
      title: 'Khai trương khu spa mới',
      date: '1 tháng 7, 2025',
      image: '/images/luxury-hotel-pool-area.jpg',
      excerpt:
        'Trải nghiệm dịch vụ spa đẳng cấp thế giới hoàn toàn mới của chúng tôi.',
    },
    {
      title: 'Nhà hàng đạt sao Michelin',
      date: '10 tháng 8, 2025',
      image: '/images/luxury-hotel-pool-area.jpg',
      excerpt:
        'Nhà hàng của chúng tôi vinh dự nhận được ngôi sao Michelin đầu tiên.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground text-balance">
            News & Events
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <Link href="#">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.title}
                  className="w-full h-58 object-cover"
                  width={500}
                  height={80}
                />
              </Link>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  {item.date}
                </p>
                <Link href="#">
                  <h3 className="font-serif text-xl font-bold mb-3 text-foreground hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground leading-relaxed">
                  {item.excerpt}
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
