# Technical Assignment CyberSecurity Engineer
- Nama			: Ridwan Hawafi Zakaria
- Nama Aplikasi	: Secure Image Upload Web Application

# Fitur Utama
- Registrasi & Login: Pengguna dapat membuat akun dan masuk.
- Upload Gambar Aman: Validasi format (.jpg/.png), maksimal 2MB.
- Enkripsi Otomatis: Gambar dienkripsi sebelum disimpan.
- Galeri Pribadi: Tampil gambar milik sendiri (dengan dekripsi otomatis).
- Hapus Gambar: Pengguna dapat menghapus gambarnya.
- Feedback Interaktif: Menggunakan popup SweetAlert.

# Teknologi
- Backend: Node.js + Express
- Frontend: HTML + Bootstrap + SweetAlert
- Database: PostgreSQL (Docker)
- Auth: JWT Token
- Enkripsi: AES-256-CBC (crypto)
- Deploy: Docker Compose

# Cara Menjalankan (Docker)
- Buat file .env:
  - DB_HOST=db
  - DB_USER=user
  - DB_PASSWORD=password
  - DB_NAME=secure_image_db
  - DB_PORT=5432
  - PORT=3000
  - JWT_SECRET=supersecretjwt
  - ENCRYPTION_KEY=emy32byteencryptionkey1234567890
- Jalankan:
  - docker-compose up -d --build
- Akses di browser: http://localhost:3000

# Keamanan
- Password di-hash dengan bcrypt
- Gambar terenkripsi AES-256
- Autentikasi via JWT Token
- Validasi file ketat (.jpg/.png, max 2MB)

