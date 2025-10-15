# 🏨 Hotel Booking Platform (Next.js + NestJS + Turborepo)

Dự án **đặt phòng khách sạn trực tuyến** được xây dựng với **Next.js** (frontend) và **NestJS** (backend) trong kiến trúc **monorepo sử dụng Turborepo**.  


## ⚙️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|-------------|------------|
| **Frontend** | [Next.js 15+](https://nextjs.org/) |
| **Backend** | [NestJS 10+](https://nestjs.com/) |
| **Monorepo** | [Turborepo](https://turbo.build/repo) |
| **Ngôn ngữ** | TypeScript |
| **Cơ sở dữ liệu** | |
| **ORM** | Prisma |
| **UI** | Tailwind CSS, shadcn/ui |
| **Auth** | JWT / OAuth2 |

---

## 🚀 Cài đặt & Chạy dự án

### 1️⃣ Clone dự án

```bash
git clone https://github.com/kinyias/hotel-booking-web
cd hotel-booking
```
### 2️⃣ Cài đặt dependencies
```bash
npm install
```
### 3️⃣ Chạy dự án
✅ Chạy cả frontend + backend cùng lúc
```bash
npm run dev
```
🔹 Chạy riêng frontend (Next.js)
```bash
npm run dev --filter=web
```
🔹 Chạy riêng backend (NestJS)
```bash
npm run dev --filter=api
```
## 🧠 Chức năng chính

### 👤 Người dùng
 
#### 🔐 Xác thực người dùng
- Đăng ký / Đăng nhập
- Đăng nhập bằng Google
- Quên / đặt lại mật khẩu
- Bảo mật JWT

