# 🍽️ L'Élite Gourmet - Frontend Project

Dự án giao diện website nhà hàng cao cấp L'Élite Gourmet. Dự án sử dụng **Vite** để quản lý môi trường phát triển, bao gồm hai phần giao diện tách biệt: Trang dành cho Khách hàng và Trang Quản trị (Admin Dashboard).

## 📂 Cấu trúc dự án nổi bật

Dự án áp dụng kiến trúc Multi-Page App (MPA) để đảm bảo không xung đột tài nguyên giữa các khu vực:

- **`/backend` (Thư mục gốc):** Chứa code của backend. (Spring Boot)
- **`/frontend/client`:** Chứa HTML, CSS, JS của giao diện khách hàng (Trang chủ, Menu, Giỏ hàng, Đặt bàn,...).
- **`/frontend/admin`:** Chứa toàn bộ giao diện và tài nguyên (assets) độc lập của phân hệ Quản trị viên.
- **`/database`:** Chứa dữ liệu của CSDL (restaurant.sql)

## 🚀 Hướng dẫn cài đặt và chạy dự án (Local)

### 1. Yêu cầu hệ thống (Prerequisites)

Đảm bảo máy tính của bạn đã cài đặt sẵn [Node.js](https://nodejs.org/).
Đảm bảo bạn đã tạo 1 CSDL có tên là restaurant trong MYSQL
Đảm bảo đã clone dự án về máy tính và truy cập vào dự án bằng IDE VScode/Intellij

### 2. Các bước chạy dự án

## Sau khi đã chạy phần Backend( nhớ sửa tên và passwd mysql trong file application.properties theo của b nhé), mở Terminal và chạy lần lượt các lệnh sau:

```bash
Bước 1: Cài đặt thư viện (Dependencies):
cd frontend/client
npm install
Bước 2: Khởi động Dev Server:
npm run dev
🌐 Đường dẫn truy cập (Local URLs)
Sau khi Dev Server khởi động thành công , bạn có thể truy cập qua trình duyệt:

Trang Khách hàng (Client): http://localhost:3000/

Trang Quản trị (Admin): http://localhost:3000/admin/
```
