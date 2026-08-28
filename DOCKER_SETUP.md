# 🐳 Setup Docker untuk TechSolution di Linux Mint

## ✅ Prerequisites
- Docker sudah terinstall
- Docker Compose sudah terinstall
- Terminal/Command line

## 🚀 Quick Start (Cara Tercepat)

### 1. Clone Repository
```bash
git clone https://github.com/lor11an/TechSolution.git
cd TechSolution
```

### 2. Jalankan Aplikasi
```bash
docker-compose up --build
```

### 3. Buka di Browser
```
http://localhost:3000
```

✨ **Aplikasi sudah berjalan!**

---

## 📋 Opsi Lainnya

### Opsi A: Production Mode (Recommended untuk Testing)
```bash
# Build image
docker-compose build

# Jalankan container
docker-compose up -d

# Lihat logs
docker-compose logs -f

# Buka browser: http://localhost:3000

# Stop container
docker-compose down
```

### Opsi B: Development Mode (Dengan Hot Reload)
```bash
# Jalankan dengan docker-compose.dev.yml
docker-compose -f docker-compose.dev.yml up

# Buka browser: http://localhost:5173
# File akan auto-reload saat ada perubahan
```

### Opsi C: Manual Docker Commands
```bash
# Build image
docker build -t techsolution:latest .

# Jalankan container
docker run -d \
  --name techsolution-app \
  -p 3000:3000 \
  techsolution:latest

# Lihat logs
docker logs -f techsolution-app

# Buka browser: http://localhost:3000

# Stop & remove container
docker stop techsolution-app
docker rm techsolution-app
```

---

## 🛠️ Troubleshooting

| Masalah | Solusi |
|--------|--------|
| **Permission Denied** | `sudo usermod -aG docker $USER` lalu logout/login |
| **Port 3000 sudah terpakai** | Ubah port: `docker run -p 8080:3000 techsolution:latest` |
| **Build gagal** | `docker-compose build --no-cache` |
| **Container crash** | `docker-compose logs` untuk lihat error detail |
| **Memory issue** | `docker system prune -a` untuk bersihkan |

---

## 📊 Struktur File Docker

```
TechSolution/
├── Dockerfile              (Production build)
├── Dockerfile.dev          (Development build)
├── docker-compose.yml      (Production compose)
├── docker-compose.dev.yml  (Development compose)
├── .dockerignore            (Exclude files from build)
└── tbk-wlr-app/            (Aplikasi React Vite)
    ├── package.json
    ├── src/
    ├── dist/
    └── ...
```

---

## 🎯 Port Mapping

- **Production**: Port 3000 → http://localhost:3000
- **Development**: Port 5173 → http://localhost:5173

---

## 💡 Useful Commands

```bash
# Lihat semua container yang berjalan
docker ps

# Lihat semua image
docker images

# Lihat logs real-time
docker-compose logs -f

# Masuk ke container shell
docker exec -it techsolution-app /bin/sh

# Remove image
docker rmi techsolution:latest

# Bersihkan semua container & image yang tidak digunakan
docker system prune -a
```

---

## ✨ Selesai!

Aplikasi Anda sudah siap dijalankan dengan Docker. Nikmati development dengan Docker! 🎉
