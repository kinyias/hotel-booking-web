"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi 
} from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { usePublicBannersQuery } from '@/features/banner/queries';
import { Banner } from '@/features/banner/types';
import Link from 'next/link';

// Default fallback slides
const defaultSlides = [
  {
    id: '1',
    backgroundImage: '/hero-bg.jpg',
    title: ['YOUR NEXT BOOKING', 'LUXURY HOTEL'],
    subtitle: 'Experience unparalleled comfort and elegance',
    buttonText: 'VIEW MORE',
    buttonLink: '#hotels'
  },
  {
    id: '2',
    backgroundImage: '/hero-bg-2.jpg',
    title: ['DISCOVER PARADISE', 'EXCLUSIVE RESORTS'],
    subtitle: 'Escape to breathtaking destinations',
    buttonText: 'EXPLORE NOW',
    buttonLink: '#resorts'
  },
  {
    id: '3',
    backgroundImage: '/hero-bg-3.jpg',
    title: ['UNFORGETTABLE STAYS', 'PREMIUM SERVICE'],
    subtitle: 'Where luxury meets perfection',
    buttonText: 'BOOK NOW',
    buttonLink: '#book'
  }
];

interface SlideData {
  id: string;
  backgroundImage: string;
  title: string[];
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

// Convert Banner to SlideData
function bannerToSlide(banner: Banner): SlideData {
  const titleLines = banner.title ? banner.title.split('\n').slice(0, 2) : ['LUXURY HOTEL'];
  
  return {
    id: banner.id,
    backgroundImage: banner.images[0]?.url || '/hero-bg.jpg',
    title: titleLines,
    subtitle: banner.subtitle || '',
    buttonText: 'VIEW MORE',
    buttonLink: banner.link || '#',
  };
}

interface HeroSlideProps {
  slide: SlideData;
  isActive: boolean;
}

function HeroSlide({ slide, isActive }: HeroSlideProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const dividerVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        delay: 0.5
      }
    }
  };

  const diamondVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotate: 45,
      transition: {
        delay: i * 0.2 + 0.8,
        duration: 0.5,
        ease: "backOut" as const
      }
    })
  };

  const headingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut" as const,
        delay: 1.2
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const backgroundVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut" as const
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const blurBackgroundVariants = {
    hidden: { 
      opacity: 0,
      scale: 1.1,
      filter: "blur(20px)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: "easeOut" as const,
        delay: 0.3
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.backgroundImage})` }}
        variants={backgroundVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          variants={overlayVariants}
          initial="hidden"
          animate={isActive ? "visible" : "hidden"}
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isActive ? "visible" : "hidden"}
      >
        <motion.div 
          className="hidden md:block absolute w-1/2 h-full bg-transparent backdrop-blur-xl border-white/30 border-2 left-1/2 translate-x-[-50%] z-[-10]"
          variants={blurBackgroundVariants}
          initial="hidden"
          animate={isActive ? "visible" : "hidden"}
        />
        
        {/* Decorative Divider */}
        <motion.div 
          className="flex items-center justify-center gap-4 mb-8 pt-5 md:pt-15"
          variants={itemVariants}
        >
          <motion.div 
            className="h-px w-16 bg-white/50"
            variants={dividerVariants}
            initial="hidden"
            animate={isActive ? "visible" : "hidden"}
          />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 border-2 border-white"
                custom={i}
                variants={diamondVariants}
                initial="hidden"
                animate={isActive ? "visible" : "hidden"}
              />
            ))}
          </div>
          <motion.div 
            className="h-px w-16 bg-white/50"
            variants={dividerVariants}
            initial="hidden"
            animate={isActive ? "visible" : "hidden"}
          />
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight tracking-wide"
          variants={headingVariants}
          initial="hidden"
          animate={isActive ? "visible" : "hidden"}
        >
          {slide.title.map((line, index) => (
            <motion.span key={index} className="block" variants={lineVariants}>
              {line}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-white/90 text-lg md:text-xl mb-8 font-light"
          variants={itemVariants}
        >
          {slide.subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate={isActive ? "visible" : "hidden"}
          whileHover="hover"
          whileTap="tap"
        >
          <Link href={slide.buttonLink}>
          <Button
            variant="default"
            className="relative overflow-hidden font-semibold text-white bg-primary rounded-none group px-8 py-6 mb-5 md:mb-20"
            >
            <span className="relative z-10 text-md md:text-xl">{slide.buttonText}</span>
            <span className="absolute inset-0 bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
          </Button>
            </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

function HeroBanner() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  
  // Fetch banners from API
  const { data: banners, isLoading } = usePublicBannersQuery();

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Convert banners to slides or use default slides
  const slides: SlideData[] = React.useMemo(() => {
    if (isLoading) return defaultSlides;
    if (!banners || banners.length === 0) return defaultSlides;
    return banners.map(bannerToSlide);
  }, [banners, isLoading]);

  return (
    <section className="relative">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
          align: 'start',
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide: SlideData, index: number) => (
            <CarouselItem key={slide.id}>
              <HeroSlide slide={slide} isActive={current === index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Custom Navigation Buttons */}
        <CarouselPrevious 
          className="left-4 md:left-8 size-12 bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/20 text-white"
        />
        <CarouselNext 
          className="right-4 md:right-8 size-12 bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/20 text-white"
        />
      </Carousel>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_: SlideData, index: number) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;