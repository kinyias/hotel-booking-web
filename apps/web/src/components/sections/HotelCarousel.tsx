'use client';
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
import Link from 'next/link';
import { useListAllRoomTypesQuery } from '@/features/room-types/queries';
import PrimaryButton from '../shared/PrimaryButton';
import { formatCurrency } from '@/utils/currency';

const HotelCarousel = () => {
  const { data: roomTypes } = useListAllRoomTypesQuery(3);

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
            {roomTypes?.data.map((room) => (
              <CarouselItem
                key={room.id}
                className="pl-4 basis-[100%] md:basis-[70%] lg:basis-[60%]"
              >
                <div className="relative h-[500px] lg:h-[600px] w-full">
                  <Image
                    src={room.images?.[0]?.url || '/images/hero-1.jpg'}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    width={1024}
                    height={512}
                  />

                  <Card className="absolute top-1/2 right-4 md:right-8 lg:right-16 -translate-y-1/2 bg-background p-6 md:p-8 shadow-2xl max-w-2/3 md:max-w-md gap-2">
                    <Badge className="mb-3 bg-gold text-gold-foreground hover:bg-gold/90">
                      From {formatCurrency(room.price_per_night)}
                    </Badge>

                    <p className="text-sm text-muted-foreground mb-1">
                      Max Guests: {room.max_guests}
                    </p>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl text-foreground mb-3">
                      {room.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-muted-foreground">
                      {room.amenities?.slice(0, 3).map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-1.5"
                          >
                           <Waves className="w-4 h-4" />
                            <span>{item.amenity.label}</span>
                          </div>
                        );
                      })}
                    </div>
                      <Link href={`/hotels/${room.hotelId}`}>
                        <PrimaryButton>BOOK NOW</PrimaryButton>
                      </Link>
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
