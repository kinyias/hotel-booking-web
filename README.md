# 🏨 Hotel Booking Platform (Next.js + NestJS + Turborepo)

Dự án **đặt phòng khách sạn trực tuyến** được xây dựng với **Next.js** (frontend) và **NestJS** (backend) trong kiến trúc **monorepo sử dụng Turborepo**.

## ⚙️ Công nghệ sử dụng

| Thành phần        | Công nghệ                             |
| ----------------- | ------------------------------------- |
| **Frontend**      | [Next.js 15+](https://nextjs.org/)    |
| **Backend**       | [NestJS 10+](https://nestjs.com/)     |
| **Monorepo**      | [Turborepo](https://turbo.build/repo) |
| **Ngôn ngữ**      | TypeScript                            |
| **Cơ sở dữ liệu** |                                       |
| **ORM**           | Prisma                                |
| **UI**            | Tailwind CSS, shadcn/ui               |
| **Auth**          | JWT / OAuth2                          |

---

## 🚀 Cài đặt & Chạy dự án

### 1️⃣ Clone dự án

```bash
git clone https://github.com/kinyias/hotel-booking-web
cd hotel-booking-web
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

### 👤 Module Auth (Xác thực & Quản lý người dùng)

#### 🔐 1. Đăng ký tài khoản

-   Đăng ký bằng email & mật khẩu (hash bằng **Argon2**)
-   Validate mật khẩu mạnh (bao gồm confirmPassword)
-   Tự động tạo **verifyToken** và gửi email xác minh
-   Lưu trạng thái `emailVerified = false` cho đến khi xác minh thành công

#### 📧 2. Xác minh email

-   Người dùng nhận email có link chứa token
-   Endpoint `/v1/auth/verify-email/:token` xác minh và cập nhật `emailVerified = true`
-   Hỗ trợ **resend verify email**

#### 🔑 3. Đăng nhập

-   Đăng nhập bằng email + mật khẩu
-   Kiểm tra tình trạng `emailVerified`
-   Sinh **Access Token (ngắn hạn)** và **Refresh Token (dài hạn)**
-   Lưu session vào bảng `AuthSession` gồm:
    -   `userId`, `jti`, `ip`, `userAgent`, `expiresAt`
-   Mã hoá refreshToken bằng **Argon2 hash**

#### 🔁 4. Làm mới token (Refresh Token Flow)

-   Endpoint `/v1/auth/refresh` xác thực refresh token còn hiệu lực
-   Tạo access token mới, cập nhật `AuthSession`
-   Xoá hoặc vô hiệu hoá session cũ khi logout

#### 🚪 5. Đăng xuất

-   Xoá `AuthSession` tương ứng với `jti` hiện tại
-   Ngăn chặn reuse refresh token cũ

#### 🌐 6. Đăng nhập bằng Google (OAuth2)

-   Tích hợp Google OAuth (Passport Strategy)
-   Endpoint `/v1/auth/google` → `/v1/auth/google/callback`
-   Tự động tạo hoặc liên kết user theo `providerId`
-   Sinh token đăng nhập và redirect về frontend

#### 🧩 7. Cấu trúc & bảo mật

-   Sử dụng **JwtService** của NestJS để ký & xác thực token
-   Tách biệt rõ **AccessToken** và **RefreshToken**
-   Áp dụng **Guards**: `JwtAuthGuard`, `GoogleAuthGuard`
-   Dùng **Zod Validation Pipe** để validate DTO mạnh mẽ
-   Log IP & thiết bị để theo dõi đăng nhập bất thường

---

✅ **Module Auth hiện đã hoàn thiện đầy đủ:**

-   [x] Register / Login / Logout
-   [x] Email Verification
-   [x] Google OAuth
-   [x] Refresh Token & Session Management
-   [x] Strong Password Validation
-   [x] JWT Guards + Error Handling
-   [x] Device & IP tracking
