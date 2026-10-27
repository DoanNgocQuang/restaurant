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
└── .gitlab-ci.yml      # Cấu hình GitLab CI/CD
```

## Chạy dự án local

### Yêu cầu hệ thống

- Cài đặt [Node.js](https://nodejs.org/)
- Cài đặt JDK 25
- Cài đặt MySQL hoặc MariaDB
- Tạo database tên `restaurant`
- Clone dự án về máy và mở bằng VS Code, IntelliJ IDEA hoặc IDE tương đương

### Cấu hình backend

Đặt biến môi trường cho terminal hoặc IDE, không ghi mật khẩu vào source. Ví dụ PowerShell:

```powershell
$env:DB_URL = 'jdbc:mysql://localhost:3306/restaurant'
$env:DB_USER = 'restaurant'
$env:DB_PASSWORD = '<mat-khau-local>'
```

Trên Linux/macOS dùng `export DB_URL=...`, `export DB_USER=...`, `export DB_PASSWORD=...`. Spring không tự đọc file `.env` của Docker Compose khi chạy Java trực tiếp.

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
npm ci
npm run dev
```

Sau khi dev server khởi động thành công, truy cập:

- **Trang khách hàng:** `http://localhost:3000/`
- **Trang quản trị:** `http://localhost:3000/admin/`

## Triển khai production bằng Docker

### Yêu cầu

- Cài đặt [Docker](https://docs.docker.com/engine/install/) có BuildKit.
- Cài đặt [Docker Compose](https://docs.docker.com/compose/install/) v2.20 trở lên (hoặc v5).

### Các bước chạy

Tại thư mục gốc repo, sao chép `.env.example` thành `.env` (`cp .env.example .env` trên Linux, `Copy-Item .env.example .env` trên PowerShell). Điền `DB_PASSWORD` và `DB_ROOT_PASSWORD`; Compose từ chối chạy nếu thiếu hoặc để trống. File thật được Git bỏ qua. `DB_NAME` và `DB_USER` mặc định là `restaurant`.

**Nếu đã có database, dùng đúng tên database, user và mật khẩu hiện tại.** Đổi biến môi trường không tự đổi tài khoản trong MariaDB. Giữ nguyên tên Compose project để dùng lại đúng volume; nếu dùng `-p`, dùng cùng giá trị cho mọi lệnh. Đọc phần chuyển dữ liệu bên dưới trước khi cập nhật stack cũ.

```bash
docker compose config --quiet
docker compose build --pull
docker compose up -d --no-build --wait --wait-timeout 240
```

`up` là bước triển khai, chỉ chạy trên môi trường bạn chủ định sử dụng. Tránh in toàn bộ `docker compose config` vào log vì cấu hình nội suy có thể chứa mật khẩu.

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

Nginx nghe port nội bộ `8080`, được publish qua port `80`, proxy `/api/` và `/uploads/` tới backend. Nginx và Java đều chạy non-root. Nginx phân giải lại DNS để proxy tiếp sau khi backend được tạo lại.

Backend giới hạn **1 GiB RAM**, mặc định `JAVA_TOOL_OPTIONS=-Xms128m -XX:MaxRAMPercentage=60.0`. Có thể ghi đè biến này trong `.env` hoặc CI, nhưng cần chừa RAM ngoài heap. Giới hạn này cần được kiểm tra thêm theo tải thực tế.

Backend chờ truy vấn database thành công; frontend chờ backend khỏe. Endpoint `http://localhost:8080/actuator/health/readiness` kiểm tra cả database, chỉ trả trạng thái, không công khai chi tiết/component. Frontend có `/healthz`. Healthcheck đánh dấu container unhealthy; không tự khởi động lại một tiến trình vẫn chạy.

Named volume `db_data` lưu database; `uploads_data` lưu `/app/uploads` với quyền cho user `restaurant` (UID/GID 10001). `docker compose down` giữ volume; **không dùng `down --volumes` với dữ liệu thật**.

### Chuyển dữ liệu từ cấu hình cũ lần đầu

Thực hiện thủ công trong cửa sổ bảo trì trên server Linux. Điền `.env` bằng thông tin database đang dùng và build image mới; chưa chạy `up` để tránh xóa container chứa upload cũ.

Sao lưu database và kiểm tra file sao lưu, lưu thêm bản sao ngoài server:

```bash
mkdir -p backups/uploads
docker exec mydb sh -c 'MYSQL_PWD="${MARIADB_ROOT_PASSWORD:-$MYSQL_ROOT_PASSWORD}" exec mariadb-dump -uroot --single-transaction --routines --events --all-databases' > backups/database.sql
```

Dừng frontend/backend để ngăn upload mới, lấy file khỏi container cũ **trước khi tạo lại container**:

```bash
docker compose stop fe be
docker cp mybe:/app/uploads/. ./backups/uploads/
```

Nếu container cũ chưa từng có thư mục upload thì bỏ qua lệnh `docker cp`. Dùng image mới để khởi tạo volume và chép file đã sao lưu, không chạy ứng dụng:

```bash
docker compose run --rm --no-deps --user 0 --entrypoint sh \
  --volume "$PWD/backups/uploads:/restore:ro" be \
  -c 'cp -a /restore/. /app/uploads/ && chown -R restaurant:restaurant /app/uploads'
docker compose up -d --no-build --wait --wait-timeout 240
```

Kiểm tra ảnh cũ qua `/uploads/...`, upload ảnh mới và kiểm tra ảnh còn sau khi tạo lại backend. Database cũ tiếp tục dùng `db_data`. Không import lại `database/restaurant.sql` khi nâng cấp vì file chứa `DROP TABLE`; dữ liệu mẫu chỉ được import thủ công vào database mới, rỗng, sau khi xem nội dung SQL.

## CI/CD

Dự án có sẵn các file cấu hình CI/CD:

- `Jenkinsfile`: cấu hình pipeline cho Jenkins
- `.gitlab-ci.yml`: pipeline cho GitLab CI/CD

GitLab pipeline chạy trên Git tag: `buildandpush` → `deploy` → `showlog`. Backend đóng gói bằng `mvn package -Dmaven.test.skip=true`, bỏ qua cả biên dịch và chạy test. Runner `lab-server` cần Docker/BuildKit và Compose. Cấp biến trong GitLab settings: `REGISTRY_URL`, `REGISTRY_USER`, `REGISTRY_PROJECT`, `REGISTRY_PASSWORD`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`; thêm `DB_USER`, `DB_NAME`, `JAVA_TOOL_OPTIONS` nếu khác mặc định. Đặt biến mật khẩu ở chế độ masked/protected phù hợp với tag triển khai.

Image giữ định dạng `${REGISTRY_URL}/${REGISTRY_USER}/${REGISTRY_PROJECT}-be:${IMAGE_TAG}` (frontend tương tự), tag `${CI_COMMIT_TAG}_${CI_COMMIT_SHORT_SHA}`. Local mặc định dùng `local/restaurant/restaurant-be:local` và `local/restaurant/restaurant-fe:local`.

Registry login dùng `--password-stdin`. Deploy vẫn kích hoạt thủ công và được tuần tự hóa bằng resource group; runner phải dùng đúng Compose project của stack hiện có.

Deploy pull image và cập nhật service, chờ healthy tối đa 240 giây. Job lỗi nếu không healthy, in trạng thái/log; không tự rollback, không chạy `down`, không import SQL hay prune image toàn máy. `Jenkinsfile` vẫn là khung minh họa.

### Cập nhật base image

Các base image được khóa bằng digest xác minh từ Docker Hub. Giữ dòng Node 22, Java 25 và MariaDB 10.11. Định kỳ dùng `docker buildx imagetools inspect <image:tag>` để lấy digest mới, cập nhật Dockerfile và `docker-compose.yml`, rồi build lại image. Không chỉ đổi tag mà giữ digest cũ.
