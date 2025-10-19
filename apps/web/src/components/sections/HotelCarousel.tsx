import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Waves, Maximize2, Users } from 'lucide-react';
import Image from 'next/image';
import PrimaryButton from '../shared/PrimaryButton';

const rooms = [
  {
    id: 1,
    image: '/images/service-01.jpg',
    category: 'Siêu thoải mái',
    name: 'Phòng Deluxe',
    description:
      'Hotelo Lodge gồm các khách sạn và chalet cao cấp mang lại trải nghiệm tuyệt vời.',
    price: 30,
    amenities: [
      { icon: Waves, label: 'Hồ bơi' },
      { icon: Maximize2, label: '1200 sqft' },
      { icon: Users, label: '2–4 người' },
    ],
  },
  {
    id: 2,
    image: '/images/service-02.jpg',
    category: 'Sang trọng & Rộng rãi',
    name: 'Phòng Executive Suite',
    description:
      'Trải nghiệm sự sang trọng và thoải mái trong không gian được thiết kế tinh tế của phòng hạng Executive.',
    price: 50,
    amenities: [
      { icon: Waves, label: 'Hồ bơi' },
      { icon: Maximize2, label: '1500 sqft' },
      { icon: Users, label: '3–5 người' },
    ],
  },
  {
    id: 3,
    image: '/images/service-03.jpg',
    category: 'Đẳng cấp thượng lưu',
    name: 'Phòng Tổng Thống',
    description:
      'Tận hưởng không gian nghỉ dưỡng sang trọng nhất với tiện nghi cao cấp và dịch vụ hoàn hảo.',
    price: 100,
    amenities: [
      { icon: Waves, label: 'Hồ bơi' },
      { icon: Maximize2, label: '2000 sqft' },
      { icon: Users, label: '4–6 người' },
    ],
  },
];

const HotelCarousel = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="w-full">
        <div className="text-center mb-12 md:mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-primary text-primary uppercase tracking-wider"
          >
            Services & Offers
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-foreground font-bold">
            Discover the Latest
            <br />
            Seasonal Offers Just for You
          </h2>
        </div>

        <Carousel
          opts={{
            align: 'center',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {rooms.map((room) => (
              <CarouselItem
                key={room.id}
                className="pl-4 basis-[100%] md:basis-[70%] lg:basis-[60%]"
              >
                <div className="relative h-[500px] lg:h-[600px] w-full">
                  <Image
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    width={1024}
                    height={512}
                  />

                  <Card className="absolute top-1/2 right-4 md:right-8 lg:right-16 -translate-y-1/2 bg-background p-6 md:p-8 shadow-2xl max-w-2/3 md:max-w-md gap-2">
                    <Badge className="mb-3 bg-gold text-gold-foreground hover:bg-gold/90">
                      Từ ${room.price}
                    </Badge>

                    <p className="text-sm text-muted-foreground mb-1">
                      {room.category}
                    </p>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl text-foreground mb-3">
                      {room.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-muted-foreground">
                      {room.amenities.map((amenity, index) => {
                        const IconComponent = amenity.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-1.5"
                          >
                            <IconComponent className="w-4 h-4" />
                            <span>{amenity.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    <PrimaryButton>BOOK NOW</PrimaryButton>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex justify-center gap-2 mt-8">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default HotelCarousel;
