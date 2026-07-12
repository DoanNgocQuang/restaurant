# L'Élite Gourmet - Restaurant Website

Dự án website nhà hàng L'Élite Gourmet, gồm giao diện khách hàng, trang quản trị và backend API. Frontend được tổ chức theo mô hình Multi-Page Application (MPA) để tách riêng khu vực khách hàng và quản trị.

## Công nghệ sử dụng

- **Ngôn ngữ:** Java (Spring Boot), JavaScript, TypeScript
- **Styling:** CSS, Tailwind CSS v4
- **Data access:** Spring Data JPA, Hibernate
- **Security:** Spring Security, JWT
- **Database:** MariaDB / MySQL
- **Build tool:** Vite, Maven

### DevOps

- **Container:** Docker, Docker Compose
- **Web server:** Nginx
- **CI/CD:** Jenkins, GitLab CI/CD

## Cấu trúc dự án

```text
restaurant/
├── backend/            # Source code backend Spring Boot
├── database/           # Dữ liệu hoặc script liên quan đến CSDL
├── frontend/
│   ├── admin/          # Giao diện quản trị
│   └── client/         # Giao diện khách hàng
├── docker-compose.yml  # Cấu hình chạy production bằng Docker Compose
├── Jenkinsfile         # Cấu hình Jenkins CI/CD
└── gitlab-ci.yml       # Cấu hình GitLab CI/CD
```

## Chạy dự án local

### Yêu cầu hệ thống

- Cài đặt [Node.js](https://nodejs.org/)
- Cài đặt JDK 25
- Cài đặt MySQL hoặc MariaDB
- Tạo database tên `restaurant`
- Clone dự án về máy và mở bằng VS Code, IntelliJ IDEA hoặc IDE tương đương

### Cấu hình backend

Mở file `backend/src/main/resources/application.properties`, sau đó chỉnh thông tin kết nối database theo máy của bạn:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant
spring.datasource.username=<MYSQL_USERNAME>
spring.datasource.password=<MYSQL_PASSWORD>
```

### Khởi động backend

```bash
cd backend
./mvnw spring-boot:run
```

Trên Windows có thể dùng:

```bash
cd backend
mvnw.cmd spring-boot:run
```

Backend API chạy tại:

```text
http://localhost:8080
```

### Khởi động frontend

Mở terminal khác và chạy:

```bash
cd frontend/client
npm install
npm run dev
```

Sau khi dev server khởi động thành công, truy cập:

- **Trang khách hàng:** `http://localhost:3000/`
- **Trang quản trị:** `http://localhost:3000/admin/`

## Triển khai production bằng Docker

### Yêu cầu

- Cài đặt [Docker](https://docs.docker.com/engine/install/)
- Cài đặt [Docker Compose](https://docs.docker.com/compose/install/)

### Các bước chạy

Clone mã nguồn về server Linux, di chuyển vào thư mục gốc của dự án rồi chạy:

```bash
docker compose up -d --build
```

Kiểm tra trạng thái container:

```bash
docker compose ps
```

Xem log:

```bash
docker compose logs -f
```

Sau khi chạy thành công, các dịch vụ hoạt động tại:

- **Frontend Client & Admin:** `http://<IP_SERVER>` hoặc `http://localhost`
- **Backend API:** `http://<IP_SERVER>:8080`
- **Database MariaDB:** `<IP_SERVER>:3306`

## CI/CD

Dự án có sẵn các file cấu hình CI/CD:

- `Jenkinsfile`: cấu hình pipeline cho Jenkins
- `gitlab-ci.yml`: cấu hình pipeline cho GitLab CI/CD

Bạn có thể tùy chỉnh các file này theo môi trường triển khai thực tế.
