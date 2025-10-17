import React from 'react';
import { Input } from '../ui/input';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 px-4 bg-primary text-primary-foreground"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              LIÊN HỆ VỚI CHÚNG TÔI
            </h2>
            <p className="mb-8 leading-relaxed opacity-90">
              Bạn có thắc mắc hoặc muốn đặt phòng ngay hôm nay? Đội ngũ của
              chúng tôi luôn sẵn sàng hỗ trợ để giúp bạn lên kế hoạch cho kỳ
              nghỉ sang trọng hoàn hảo nhất.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Địa chỉ</h3>
                  <p className="opacity-90">
                    123 Luxury Avenue, Times Square, NY 10036
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Số điện thoại</h3>
                  <p className="opacity-90">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="opacity-90">reservations@hotelo.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Họ"
                  className="bg-background border-border text-foreground"
                />
                <Input
                  placeholder="Tên"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <Input
                type="email"
                placeholder="Địa chỉ Email"
                className="bg-background border-border text-foreground"
              />
              <Input
                type="tel"
                placeholder="Số điện thoại"
                className="bg-background border-border text-foreground"
              />
              <Textarea
                placeholder="Lời nhắn của bạn"
                rows={4}
                className="bg-background border-border text-foreground"
              />
              <Button className="w-full bg-accent hover:bg-black/90 hover:text-white text-accent-foreground">
                Gửi tin nhắn
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
