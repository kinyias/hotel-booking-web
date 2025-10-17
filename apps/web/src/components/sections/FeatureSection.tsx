import React from 'react'

function FeatureSection() {
  return (
    <section className="py-20 px-4 bg-background">
  <div className="container mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
        CĂN HỘ{" "}
        <span className="inline-flex items-center gap-2">
          <span className="w-8 h-0.5 bg-accent"></span>
        </span>{" "}
        SANG TRỌNG
      </h2>
      <p className="text-xl text-muted-foreground">
        DỊCH VỤ CĂN HỘ CAO CẤP TẠI TIMES SQUARE
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div className="relative aspect-square rounded-full overflow-hidden">
        <img
          src="/images/luxury-hotel-bedroom-interior.jpg"
          alt="Phòng ngủ sang trọng"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative aspect-square rounded-full overflow-hidden">
        <img
          src="/images/luxury-hotel-bathroom-marble.jpg"
          alt="Phòng tắm lát đá cẩm thạch"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative aspect-square rounded-full overflow-hidden">
        <img
          src="/images/luxury-hotel-living-room.jpg"
          alt="Phòng khách sang trọng"
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    <div className="max-w-3xl mx-auto text-center">
      <p className="text-muted-foreground leading-relaxed text-lg">
        Khám phá sự kết hợp hoàn hảo giữa tiện nghi và tinh tế trong những căn hộ được thiết kế tỉ mỉ của chúng tôi. 
        Mỗi không gian đều được trang bị nội thất cao cấp, tiện ích hiện đại và tầm nhìn tuyệt đẹp ra toàn cảnh thành phố.
      </p>
    </div>
  </div>
</section>

  )
}

export default FeatureSection