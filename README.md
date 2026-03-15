# 🍽️ L'Élite Gourmet - Frontend Project

Dự án giao diện website nhà hàng cao cấp L'Élite Gourmet. Dự án sử dụng **Vite** để quản lý môi trường phát triển, bao gồm hai phần giao diện tách biệt: Trang dành cho Khách hàng và Trang Quản trị (Admin Dashboard).

## 📂 Cấu trúc dự án nổi bật

Dự án áp dụng kiến trúc Multi-Page App (MPA) để đảm bảo không xung đột tài nguyên giữa các khu vực:
* **`/` (Thư mục gốc):** Chứa HTML, CSS, JS của giao diện khách hàng (Trang chủ, Menu, Giỏ hàng, Đặt bàn,...).
* **`/admin`:** Chứa toàn bộ giao diện và tài nguyên (assets) độc lập của phân hệ Quản trị viên.

## 🚀 Hướng dẫn cài đặt và chạy dự án (Local)

### 1. Yêu cầu hệ thống (Prerequisites)
Đảm bảo máy tính của bạn đã cài đặt sẵn [Node.js](https://nodejs.org/).

### 2. Các bước chạy dự án
Mở Terminal và chạy lần lượt các lệnh sau:

****
```bash
Bước 1: Clone dự án về máy
git clone [https://github.com/ngothanhhai-123/Elite-Gourmet-.git](https://github.com/ngothanhhai-123/Elite-Gourmet-.git)
cd Elite-Gourmet-
Bước 2: Cài đặt thư viện (Dependencies)

Bash
npm install
Bước 3: Khởi động Dev Server

Bash
npm run dev
🌐 Đường dẫn truy cập (Local URLs)
Sau khi Dev Server khởi động thành công (thường chạy ở cổng 5173), bạn có thể truy cập qua trình duyệt:

Trang Khách hàng (Client): http://localhost:5173/

Trang Quản trị (Admin): http://localhost:5173/admin/
