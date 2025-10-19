import Image from 'next/image';
import React from 'react';

function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-muted">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Stayra Luxury Hotel
            </h2>
            <h3 className="text-2xl font-semibold mb-6 text-foreground">
              The best way to return home
              <br />
              Is through the journeys you take
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Experience the pinnacle of luxury and comfort at Stayra. With
              world-class facilities, dedicated service, and a perfect location,
              we are the ideal choice for discerning travelers seeking an
              unforgettable stay.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From elegantly designed rooms to state-of-the-art amenities, every
              detail is meticulously crafted to bring you absolute satisfaction
              and comfort.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Image
                src="/images/luxury-hotel-building-exterior.jpg"
                alt="Hotel exterior"
                className="w-full h-64 object-cover rounded-lg"
                width={300}
                height={500}
              />
              <Image
                src="/images/luxury-hotel-reception-lobby.jpg"
                alt="Hotel lobby"
                className="w-full h-48 object-cover rounded-lg"
                width={300}
                height={500}
              />
            </div>
            <div className="space-y-4 pt-8">
              <Image
                src="/images/luxury-hotel-restaurant-dining.jpg"
                alt="Hotel restaurant"
                className="w-full h-48 object-cover rounded-lg"
                width={300}
                height={500}
              />
              <Image
                src="/images/luxury-hotel-pool-area.jpg"
                alt="Hotel pool"
                className="w-full h-64 object-cover rounded-lg"
                width={300}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
