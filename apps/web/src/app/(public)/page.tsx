import BookingFilter from "@/components/booking/BookingFilter";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import FeatureSection from "@/components/sections/FeatureSection";
import HeroBanner from "@/components/sections/HeroBanner";
import HotelCarousel from "@/components/sections/HotelCarousel";
import NewsSection from "@/components/sections/NewsSection";

export default function Home() {
  return (
   <>
    <HeroBanner />
    <BookingFilter />
    <FeatureSection />
    <HotelCarousel />
    <AboutSection />
    <ContactSection />
    <NewsSection />
   </>
  );
}
