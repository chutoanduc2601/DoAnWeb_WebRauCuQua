#  Farmily — Nền Tảng Thương Mại Điện Tử Rau Củ Quả Sạch

> **Đồ án Web** — Ứng dụng bán rau củ quả sạch trực tuyến với đầy đủ chức năng cho người dùng và quản trị viên.

Farmily kết nối trực tiếp nông trại đạt chuẩn VietGAP & GlobalGAP đến bàn ăn gia đình, loại bỏ trung gian để mang lại thực phẩm tươi sạch với giá hợp lý.

---

##  Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Tính Năng](#-tính-năng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt & Chạy](#-cài-đặt--chạy)
- [Biến Môi Trường](#-biến-môi-trường)
- [Ảnh Chụp Màn Hình](#-ảnh-chụp-màn-hình)
- [Tác Giả](#-tác-giả)

---

##  Tổng Quan

Farmily là một ứng dụng thương mại điện tử full-stack gồm:

- **Frontend (React + Vite):** Giao diện người dùng hiện đại, responsive, với animation mượt mà.
- **Backend (Spring Boot):** RESTful API quản lý sản phẩm, đơn hàng, khuyến mãi, đánh giá, hoàn hàng.
- **Supabase:** Xác thực người dùng (Email/Password, OAuth Google), real-time chat, lưu trữ hình ảnh.
- **PostgreSQL:** Cơ sở dữ liệu quan hệ lưu trữ toàn bộ dữ liệu nghiệp vụ.

---

##  Công Nghệ Sử Dụng

### Frontend
| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| React | 19 | Thư viện UI |
| Vite | 8 | Build tool |
| Tailwind CSS | 4 | Styling utility-first |
| Framer Motion | 12 | Animation |
| React Router DOM | 7 | Routing SPA |
| Recharts | 3 | Biểu đồ thống kê |
| Supabase JS | 2 | Auth & Realtime |
| Lucide React | — | Icon |

### Backend
| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| Java | 17 | Ngôn ngữ |
| Spring Boot | 3.4.1 | Framework |
| Spring Data JPA | — | ORM |
| Spring Security + OAuth2 | — | Bảo mật JWT |
| PostgreSQL | — | Database |
| Lombok | — | Giảm boilerplate |

### Dịch Vụ Bên Ngoài
- **Supabase** — Authentication, Realtime (chat), Storage (hình ảnh)
- **Vercel** — Deploy frontend

---

##  Tính Năng

### Phía Người Dùng
- 🏠 Trang chủ với Hero Section và câu chuyện thương hiệu
- 🛒 Duyệt & tìm kiếm sản phẩm theo danh mục
- 📦 Xem chi tiết sản phẩm, đánh giá & nhận xét
- 🛍 Giỏ hàng (lưu localStorage) & thanh toán
- 📋 Lịch sử đơn hàng & theo dõi trạng thái
- 🔄 Yêu cầu hoàn hàng / khiếu nại
- 🎉 Xem khuyến mãi đang diễn ra
- 👤 Quản lý hồ sơ cá nhân
- 💬 Chat realtime với nhân viên hỗ trợ
- 🔐 Đăng ký / Đăng nhập (Email, Google OAuth)
- 🔑 Quên mật khẩu & đặt lại mật khẩu
- 🔔 Thông báo bán hàng tự động

### Phía Quản Trị (Admin)
- 📊 Dashboard tổng quan (doanh thu, đơn hàng, khách hàng)
- 📦 CRUD sản phẩm (tên, giá, danh mục, ảnh, tags, tồn kho)
- 🗂 Quản lý danh mục
- 📋 Quản lý đơn hàng (xác nhận, giao hàng, hoàn thành)
- 👥 Quản lý khách hàng
- 🎁 Quản lý khuyến mãi
- 📈 Báo cáo thống kê
- 👤 Quản lý tài khoản
- 💬 Hỗ trợ khách hàng (chat realtime)
- 🔄 Xử lý hoàn hàng / khiếu nại
- 🌙 Chế độ tối (Dark Mode)
- 🔔 Thông báo realtime đơn hàng mới & tin nhắn

---

## Cấu Trúc Dự Án

```
raucuqua/
├── fe/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── admin/               # Module quản trị
│   │   │   ├── components/      # Component dùng chung cho admin
│   │   │   ├── pages/           # Các trang admin (Dashboard, Products, Orders, ...)
│   │   │   └── AdminLayout.jsx  # Layout chính admin
│   │   ├── components/          # Component người dùng
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── CartSidebar.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── ChatWidget.jsx
│   │   │   └── ...
│   │   ├── contexts/            # React Context (AuthContext)
│   │   ├── services/            # Service layer (chatService)
│   │   ├── lib/                 # Supabase client
│   │   ├── App.jsx              # Root component & routing
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── be/                          # Backend (Spring Boot)
│   ├── src/main/java/com/raucuqua/be/
│   │   ├── config/              # SecurityConfig, DataInitializer
│   │   ├── controller/          # REST Controllers
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── entity/              # JPA Entities
│   │   │   ├── Product.java
│   │   │   ├── Order.java
│   │   │   ├── Category.java
│   │   │   ├── User.java
│   │   │   ├── Promotion.java
│   │   │   ├── Review.java
│   │   │   ├── ReturnRequest.java
│   │   │   └── ...
│   │   ├── repository/          # JPA Repositories
│   │   ├── service/             # Business Logic
│   │   └── BeApplication.java   # Main class
│   ├── pom.xml
│   └── src/main/resources/
│       └── application.properties
│
└── README.md
```

---

## Cài Đặt & Chạy

### Yêu Cầu

- **Java** 17+
- **Maven** 3.8+
- **Node.js** 18+
- **PostgreSQL** (hoặc Supabase)

### 1. Clone dự án

```bash
git clone https://github.com/<your-username>/DoAnWeb_WebRauCuQua.git
cd DoAnWeb_WebRauCuQua
```

### 2. Chạy Backend

```bash
cd be

# Tạo file .env với các biến môi trường (xem mục Biến Môi Trường)

# Build & chạy
./mvnw spring-boot:run
```

Backend sẽ chạy tại `http://localhost:8080`

### 3. Chạy Frontend

```bash
cd fe

# Tạo file .env với các biến môi trường (xem mục Biến Môi Trường)

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173`

---

## Biến Môi Trường

### Frontend (`fe/.env`)

```env
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_API_BASE_URL=http://localhost:8080
```

### Backend (`be/.env`)

```env
SUPABASE_JWT_SECRET=<supabase-jwt-secret>
```

Cấu hình database trong `be/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://<host>:<port>/<database>
spring.datasource.username=<username>
spring.datasource.password=<password>
```

> **Lưu ý:** Không commit các file `.env` chứa thông tin nhạy cảm lên repository.

---

##  Ảnh Chụp Màn Hình

> *Cập nhật thêm ảnh chụp màn hình giao diện tại đây.*

---

##  Tác Giả

- **Chu Toàn Đức** — Sinh viên năm 4
- **Nguyễn Thái Bảo** — Sinh viên năm 4

---

## Mục đích

Dự án này được thực hiện cho mục đích học tập (đồ án môn học).
