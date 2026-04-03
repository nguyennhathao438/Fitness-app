# Hướng dẫn chạy project (React + Laravel + FastAPI)

## Yêu cầu hệ thống

Cài đặt các công cụ sau trước:

- Node.js (>= 16)
- PHP (>= 8.1)
- Composer
- Python (>= 3.8, <= 3.12)
- MySQL hoặc SQL Server

---

# 1. Backend (Laravel)

## Di chuyển vào thư mục

```bash
cd fitness-be
```

## Cài thư viện

```bash
composer install
```

## Tạo file môi trường

```bash
cp .env.example .env
```

## Generate key

```bash
php artisan key:generate
```

## Cấu hình database trong `.env`

```env
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

## Migrate + seed dữ liệu

```bash
php artisan migrate:fresh --seed
```

## Clear cache

```bash
php artisan config:clear
php artisan cache:clear
```

## Chạy server

```bash
php artisan serve
```

Backend chạy tại: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## Chạy queue

```bash
php artisan queue:work
```

## Realtime server

```bash
php artisan reverb:start
```

## Job xử lý hết hạn

```bash
php artisan pt:expire
```

---

# 2. AI Server (FastAPI)

## Di chuyển thư mục

```bash
cd model-folder
```

## Tạo virtual environment

```bash
python -m venv venv
```

## Kích hoạt môi trường

```bash
venv\Scripts\activate
```

## Cài thư viện

```bash
pip install -r requirements.txt
```

## Chạy server

```bash
uvicorn main:app --port 8001
```

API chạy tại: [http://127.0.0.1:8001](http://127.0.0.1:8001)

---

# 3. Frontend (React)

## Di chuyển thư mục

```bash
cd frontend
```

## Cài thư viện

```bash
npm install
```

## Chạy app

```bash
npm run dev
```

Frontend chạy tại: [http://localhost:5173](http://localhost:5173)

---

# 4. Kiểm tra port

```bash
netstat -ano | findstr :8000
netstat -ano | findstr :8001
```

## Kill tiến trình

```bash
taskkill /PID xxxx /F
```

---

# 5. Thứ tự chạy

1. AI Server (FastAPI)
2. Laravel Backend
3. Queue + Reverb
4. React Frontend

---

# 6. Lỗi thường gặp

## Port đã được sử dụng

```bash
php artisan serve --port=8002
```

## Lỗi database

- Kiểm tra lại file `.env`

## API không kết nối AI

- Kiểm tra server Python đã chạy chưa
- Kiểm tra port 8001

## Lỗi node_modules

```bash
rm -rf node_modules
npm install
```

---

# Ghi chú

- Đảm bảo chạy đầy đủ các service trước khi test
- Có thể dùng Postman để test API

---

# Tác giả

- Project fullstack gồm React + Laravel + FastAPI
