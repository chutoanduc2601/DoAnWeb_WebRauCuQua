# Hướng dẫn Kiểm thử Tích hợp VNPay Sandbox

Tài liệu này hướng dẫn cách chạy dự án và thực hiện giao dịch thử nghiệm bằng cổng thanh toán **VNPay Sandbox**.

---

## 🚀 1. Cách chạy ứng dụng

### Chạy Backend (Spring Boot)
1. Mở terminal tại thư mục `be`.
2. Chạy lệnh để khởi động server Spring Boot:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *Lưu ý*: Server mặc định chạy tại cổng `8082` (hoặc cổng cấu hình trong `PORT` / `application.properties`).

### Chạy Frontend (React Vite)
1. Mở terminal tại thư mục `fe`.
2. Đảm bảo đã cài đặt đủ các thư viện (`npm install`).
3. Khởi động môi trường phát triển:
   ```powershell
   npm run dev
   ```
   *Lưu ý*: Client mặc định chạy tại địa chỉ `http://localhost:5173`.

---

## 🛠️ 2. Cấu hình Tham số Sandbox (Tùy chọn)

Mặc định, hệ thống đã cài đặt sẵn thông số Test Sandbox chung của VNPay:
*   **vnp_TmnCode**: `2QXUIBJZ`
*   **vnp_HashSecret**: `953574936ce6e100f722956cf0a43093`

Nếu muốn sử dụng tài khoản Sandbox riêng của bạn, hãy cập nhật các biến này trong file `.env` ở thư mục `be`:
```env
VNPAY_TMN_CODE=Mã_TmnCode_Của_Bạn
VNPAY_HASH_SECRET=Khóa_Bảo_Mật_Của_Bạn
```

---

## 💳 3. Thông tin Thẻ Test VNPay Sandbox

Khi thanh toán trên giao diện cổng VNPay Sandbox, bạn hãy chọn thanh toán qua **Thẻ nội địa (ATM)** hoặc **Ứng dụng ngân hàng (QR)**. Dưới đây là thông tin thẻ test tiêu chuẩn của ngân hàng NCB (Ngân hàng Quốc Dân):

| Trường thông tin | Giá trị thẻ Test |
| :--- | :--- |
| **Ngân hàng** | NCB |
| **Số thẻ** | `9704198526191432198` |
| **Tên chủ thẻ** | `NGUYEN VAN A` |
| **Ngày phát hành** | `07/15` |
| **Mã OTP** | `123456` |

---

## 🔍 4. Các kịch bản kiểm thử (Test Cases)

### Kịch bản 1: Thanh toán thành công (Mã GD `00`)
1. Thêm một số sản phẩm vào giỏ hàng trên trang web Farmily.
2. Đi tới màn hình **Thực Hiện Thanh Toán**.
3. Điền thông tin cá nhân và chọn phương thức **Thanh toán qua VNPAY**.
4. Bấm **Xác Nhận Đặt Hàng**. Bạn sẽ được tự động chuyển hướng sang trang thanh toán của VNPay Sandbox.
5. Chọn ngân hàng **NCB**, nhập số thẻ và thông tin test ở bảng trên.
6. Nhập mã OTP là `123456`.
7. Nhấn xác nhận. VNPay sẽ xử lý giao dịch thành công và redirect bạn về trang `http://localhost:5173/payment/vnpay-callback?...`.
8. Hệ thống hiển thị màn hình thông báo **Thanh Toán Thành Công!** kèm hiệu ứng chuyển động và mã đơn hàng của bạn. Giỏ hàng sẽ được xóa sạch.

### Kịch bản 2: Hủy bỏ giao dịch / Thanh toán thất bại
1. Lặp lại các bước 1-4 của kịch bản trên để sang trang VNPay.
2. Trên trang thanh toán VNPay, nhấn nút **Hủy giao dịch** (hoặc quay lại).
3. VNPay sẽ chuyển bạn trở lại trang `vnpay-callback` với mã phản hồi lỗi.
4. Giao diện trang web sẽ chuyển sang trạng thái thông báo **Thanh Toán Thất Bại** kèm nút **Thử thanh toán lại** hoặc **Quay về trang chủ**. Trạng thái đơn hàng trong admin sẽ là `CANCELLED` kèm lý do tương ứng.
