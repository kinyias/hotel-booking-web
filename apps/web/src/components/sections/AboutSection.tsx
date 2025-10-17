import Image from 'next/image';
import React from 'react';

function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-muted">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Khách sạn cao cấp Stayra
            </h2>
            <h3 className="text-2xl font-semibold mb-6 text-foreground">
              Cách trở về tuyệt vời nhất
              <br />
              Chính là bằng những chuyến tàu
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Trải nghiệm đỉnh cao của sự sang trọng và thoải mái tại Stayra.
              Với cơ sở vật chất đẳng cấp quốc tế, dịch vụ tận tâm và vị trí
              hoàn hảo, chúng tôi là lựa chọn lý tưởng cho những du khách sành
              điệu tìm kiếm một kỳ nghỉ đáng nhớ.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Từ những căn phòng được thiết kế tinh tế đến các tiện nghi hiện
              đại bậc nhất, mọi chi tiết đều được chăm chút tỉ mỉ để mang đến sự
              hài lòng và thoải mái tuyệt đối cho bạn.
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
