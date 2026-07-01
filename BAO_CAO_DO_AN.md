# TRƯỜNG ĐẠI HỌC NÔNG LÂM THÀNH PHỐ HỒ CHÍ MINH
# KHOA CÔNG NGHỆ THÔNG TIN
# ----------------------------------------------------

# BÁO CÁO ĐỒ ÁN MÔN HỌC: PHÁT TRIỂN ỨNG DỤNG WEB
## ĐỀ TÀI: WEBSITE BÁN RAU CỦ QUẢ SẠCH TRỰC TUYẾN - FARMILY

**Giảng viên hướng dẫn:** (Điền tên Giảng viên hướng dẫn tại đây)  
**Lớp học:** (Điền tên lớp học tại đây)  
**Niên khóa:** 2022 - 2026  

---

## 👥 1. THÀNH VIÊN NHÓM VÀ PHÂN CÔNG CÔNG VIỆC

Nhóm thực hiện gồm có **02 thành viên** đến từ **Khoa Công nghệ Thông tin - Trường Đại học Nông Lâm TP.HCM (HCMUAF)** với phân chia công việc chi tiết như sau:

| Thành viên | Mã số Sinh viên | Vai trò chính | Công việc đảm nhận chi tiết | Tỷ lệ đóng góp |
| :--- | :--- | :--- | :--- | :---: |
| **Chu Toàn Đức** | **22130047** | **Backend Lead & Security Architect** | • Thiết lập khung dự án Spring Boot và tích hợp Supabase Auth với Spring Security.<br>• Xử lý kiểm tra tính hợp lệ của JWT token (`NimbusJwtDecoder` với khóa HS256).<br>• Tích hợp luồng đăng nhập nhanh bằng **Google OAuth 2.0** trên React và Backend.<br>• Phát triển hệ thống REST API: Quản lý đơn hàng, Đánh giá sản phẩm, Khuyến mãi, Doanh thu & Báo cáo, Đổi/Trả hàng.<br>• Phối hợp tích hợp và xử lý giao diện Chat real-time phía Admin. | **50%** |
| **Nguyễn Thái Bảo** | **22130021** | **Frontend UX/UI & System Optimizer** | • Phát triển toàn bộ giao diện Storefront UI/UX sử dụng ReactJS và Tailwind CSS.<br>• Thiết kế chức năng Quản lý Hồ sơ cá nhân (avatar, SĐT, địa chỉ nhận hàng) và Lịch sử mua hàng chi tiết.<br>• Phát triển quy trình Quên mật khẩu & Reset Password (gửi email, nhận mã, đổi mật khẩu mới).<br>• Xây dựng hệ thống Giỏ hàng (`localStorage`), Thanh toán đa bước tích hợp voucher, Admin Console điều hướng mượt mà.<br>• Thiết lập Dockerfile phục vụ đóng gói và triển khai dự án. | **50%** |

---

## 📝 2. TÓM TẮT NỘI DUNG PROJECT (EXECUTIVE SUMMARY)

**Farmily** không chỉ dừng lại ở một trang web bán hàng cơ bản, mà là một giải pháp TMĐT hoàn chỉnh tập trung cao vào Trải nghiệm người dùng (UX) và Nghiệp vụ quản trị toàn diện.

### 🌟 Các Phân Hệ & Tính Năng Nổi Bật:

* **Hệ thống Xác thực bảo mật nâng cao (Authentication & Google OAuth 2.0)**:
  Đăng nhập, đăng ký tài khoản với cơ chế bảo mật kép: Supabase xử lý luồng đăng ký/gửi email kích hoạt, Spring Security ở Backend đóng vai trò kiểm tra tính hợp lệ của JWT token cho mọi API request. Hỗ trợ đăng nhập nhanh bằng **Google OAuth 2.0**.
* **Quy trình Quên mật khẩu & Reset Password**:
  Tích hợp luồng gửi email reset mật khẩu bảo mật qua Supabase. Khi người dùng click vào link trong email, ứng dụng React sẽ chuyển hướng đến trang `/reset-password` để nhập mật khẩu mới một cách an toàn.
* **Hồ sơ cá nhân & Lịch sử đơn hàng chi tiết**:
  Khách hàng chủ động chỉnh sửa thông tin cá nhân (ảnh đại diện, số điện thoại, địa chỉ nhận hàng). Phần "Lịch sử mua hàng" hiển thị chi tiết tiến trình vận chuyển của từng đơn hàng theo thời gian thực: `Chờ xác nhận` ➔ `Đang chuẩn bị` ➔ `Đang giao` ➔ `Đã giao` ➔ `Đã hủy`.
* **Trang mua sắm thông minh (Smart Storefront)**:
  Giao diện trực quan, hỗ trợ khách hàng tìm kiếm nông sản nhanh, chọn khối lượng linh hoạt (gam, kg) với cơ chế tự động nhân giá tiền thực tế.
* **Hệ thống Giỏ hàng & Thanh toán tối ưu**:
  Giỏ hàng lưu trữ tự động tránh mất dữ liệu khi F5. Thanh toán đa bước tích hợp lựa chọn địa chỉ linh hoạt, áp dụng mã voucher giảm giá (theo phần trăm, theo số tiền cố định, hoặc miễn phí vận chuyển) kèm hiệu ứng pháo hoa (`canvas-confetti`) chúc mừng khi đặt hàng thành công.
* **Theo dõi đơn hàng & Trả hàng chuyên nghiệp**:
  Người mua có thể theo dõi hành trình đơn hàng trực quan qua các trạng thái (Chờ duyệt, Đang xử lý, Đang giao, Đã giao). Đặc biệt, hệ thống hỗ trợ gửi Yêu cầu đổi/trả hàng (Return Request) trực tiếp từ đơn hàng đã giao kèm lý do chi tiết và hình ảnh minh chứng.
* **Đánh giá & Xếp hạng sản phẩm (Reviews & Ratings)**:
  Khách hàng đánh giá chất lượng sản phẩm bằng hệ thống 5 sao và bình luận thực tế, điểm số này tự động tổng hợp để hiển thị độ uy tín của nông sản.
* **Hộp chat hỗ trợ trực tuyến thời gian thực (Real-time Chat Support)**:
  Khách hàng có thể nhắn tin trao đổi trực tiếp với nhân viên hỗ trợ thông qua Chat Widget. Hệ thống tự động gửi tin nhắn chào mừng, cho phép tải lên hình ảnh sản phẩm bị lỗi để khiếu nại (lưu trữ trên Supabase Storage) và cập nhật trạng thái "đã xem" (read receipt) tức thì.
* **Bảng Quản trị Admin Toàn Năng (All-in-one Admin Console)**:
  * **Dashboard & Báo cáo**: Biểu đồ hóa dữ liệu doanh thu, số lượng đơn hàng thông qua Recharts.
  * **Quản lý sản phẩm & danh mục**: Cho phép thêm mới sản phẩm có tìm kiếm nâng cao, phân trang dữ liệu ở phía server để tránh quá tải trình duyệt, kiểm tra dữ liệu và xem trước hình ảnh URL ngay lập tức.
  * **Xử lý Đơn hàng & Yêu cầu Đổi trả**: Tiếp nhận, cập nhật trạng thái đơn hàng và duyệt các yêu cầu trả hàng của khách hàng.
  * **Quản trị Chat Console**: Giao diện chat tập trung giúp nhân viên phản hồi khách hàng nhanh chóng, quản lý danh sách cuộc hội thoại theo số lượng tin nhắn chưa đọc.

---

## 🛠️ 3. CÁC KỸ THUẬT VÀ CÔNG NGHỆ SỬ DỤNG (TECHNICAL STACK)

Dự án áp dụng mô hình kiến trúc **Decoupled Architecture** (tách biệt hoàn toàn Frontend và Backend) kết hợp giải pháp lưu trữ đám mây linh hoạt:

### 🎨 Phía Máy khách (Frontend - UI/UX):
* **React 19 & Vite 8**: Nền tảng xây dựng ứng dụng Web dạng SPA (Single Page Application) cho tốc độ tải cực nhanh, tối ưu hóa kích thước gói build.
* **Tailwind CSS v4 & Vanilla CSS**: Thiết kế giao diện hiện đại theo phong cách tối giản, sang trọng, tương thích tốt trên mọi thiết bị di động (Responsive Layout).
* **Framer Motion**: Tạo các chuyển động mượt mà cho giỏ hàng, hộp thoại đăng nhập và chuyển trang.
* **Supabase Client SDK**: Tích hợp các cổng kết nối Real-time (WebSockets) để lắng nghe sự thay đổi dữ liệu tin nhắn, tạo tính năng chat tương tác tức thì và tải tệp tin lên bộ lưu trữ đám mây.
* **Recharts**: Thư viện biểu đồ trực quan hóa số liệu kinh doanh trên trang Admin.
* **React Hot Toast**: Hiển thị thông báo trạng thái hoạt động đẹp mắt góc màn hình.

### ☕ Phía Máy chủ (Backend - Core Logic):
* **Spring Boot 3.4.1 & Java 17**: Xây dựng hệ thống RESTful APIs mạnh mẽ, xử lý logic nghiệp vụ chặt chẽ, tối ưu hiệu năng.
* **Spring Security & OAuth2 Resource Server**: Bảo vệ hệ thống API. Hệ thống backend hoạt động như một Resource Server, xác thực các request gửi từ client bằng cách tự giải mã mã thông báo JWT do Supabase cấp thông qua thuật toán mã hóa khóa đối xứng với cấu hình `supabase.jwt.secret` được lưu an toàn.
* **Spring Data JPA & Hibernate**: Tự động hóa ánh xạ cơ sở dữ liệu quan hệ (ORM), thao tác truy vấn dữ liệu PostgreSQL dễ dàng, an toàn chống lỗi SQL Injection.
* **Dotenv Java**: Quản lý độc lập các biến môi trường bảo mật (DB URL, Password, JWT Secret Key).

### 🗄️ Cơ sở dữ liệu và Cơ sở hạ tầng (Database & DevOps):
* **PostgreSQL (Hosted on Supabase Cloud)**: Hệ quản trị cơ sở dữ liệu mạnh mẽ, ổn định, xử lý giao dịch tốt.
* **Supabase Storage**: Lưu trữ hình ảnh sản phẩm, avatar người dùng và ảnh chat khiếu nại.
* **Docker & Dockerfile**: Container hóa ứng dụng backend giúp việc đóng gói, chạy thử nghiệm và triển khai lên các dịch vụ Cloud (như Render) trở nên nhất quán và nhanh chóng.

---

## 🏆 4. KẾT QUẢ THỰC HIỆN DỰ ÁN (KEY ACHIEVEMENTS)

Qua quá trình phát triển bền bỉ, hai thành viên nhóm đã hoàn thành xuất sắc các mục tiêu đề ra cho đồ án:

* **Độ hoàn thiện mã nguồn**: Dự án sạch sẽ, cấu trúc thư mục phân lớp rõ ràng (`Entity`, `Repository`, `Service`, `Controller` ở Backend; `Components`, `Contexts`, `Admin`, `Services` ở Frontend). Toàn bộ mã nguồn chạy ổn định, không gặp lỗi xung đột cổng và đã tích hợp sẵn cơ chế kết nối linh hoạt theo môi trường local/deploy.
* **Những kết quả nổi bật**:
  * **Thiết kế giao diện**: Sự kết hợp giữa Tailwind v4 và các hoạt ảnh của Framer Motion mang lại cảm giác cao cấp, mượt mà và thân thiện với người dùng (tiệm cận các trang TMĐT lớn hiện nay).
  * **Cơ chế xác thực bảo mật chuẩn**: Giải quyết thành công bài toán tích hợp phân quyền giữa Supabase Auth (tiện lợi ở Frontend) và Spring Security (chặt chẽ ở Backend) thông qua xác thực JWT dùng chung mã bí mật.
  * **Tính năng Real-time thực tế**: Xây dựng thành công hệ thống chăm sóc khách hàng trực tuyến qua kênh kết nối WebSockets thời gian thực của Supabase, cho phép Admin và User trò chuyện không có độ trễ, kèm chức năng gửi ảnh chất lượng cao.
  * **Hệ thống Quản trị trực quan**: Trang quản trị cung cấp đầy đủ công cụ báo cáo biểu đồ doanh thu theo ngày/tháng thực tế từ Database thay vì sử dụng số liệu giả lập, giúp nâng cao tính thực tiễn của đồ án.
  * **Khả năng mở rộng tốt**: Cấu trúc mã nguồn được phân chia thành các thành phần (components) và lớp dịch vụ (services) độc lập, giúp dự án dễ dàng tích hợp thêm các cổng thanh toán online (VNPAY, MoMo) hoặc AI chatbot tư vấn tự động trong tương lai.
