# ✅ Cara Memastikan Menggunakan localhost:4000

## 🎯 Metode Verifikasi (Pilih Salah Satu)

---

### METODE 1: Cek di Browser Console (PALING MUDAH)

#### Langkah 1: Buka DevTools
- Buka browser ke `http://localhost:3000`
- Tekan **F12** atau **Ctrl+Shift+I** (Windows/Linux) atau **Cmd+Option+I** (Mac)
- Pilih tab **Console**

#### Langkah 2: Refresh Halaman
- Tekan **F5** atau **Ctrl+R** untuk refresh
- Lihat di console, harus ada log seperti ini:

```
============================================================
🔗 HTTP CLIENT INITIALIZED
============================================================
Base URL: http://localhost:4000
Environment: development
PUBLIC_API_BASE_URL: http://localhost:4000
Final Base URL: http://localhost:4000
============================================================
```

✅ **Jika melihat `http://localhost:4000` → BENAR!**
❌ **Jika melihat `https://api.peridotvault.com` → SALAH!**

#### Langkah 3: Test API Request
- Klik tombol "Connect Wallet"
- Lihat console untuk log request:

```
📤 API Request: { method: 'POST', url: 'http://localhost:4000/api/auth/verify', hasAuth: false }
```

✅ **URL harus: `http://localhost:4000/api/auth/verify`**

---

### METODE 2: Cek di Network Tab (PALING DETAIL)

#### Langkah 1: Buka Network Tab
- DevTools → tab **Network**
- Filter ketik: `auth`

#### Langkah 2: Connect Wallet
- Klik tombol "Connect Wallet" di aplikasi
- Sign message di Peridot Wallet

#### Langkah 3: Inspect Request
Setelah klik "Connect Wallet", akan muncul request di Network tab:

**Klik request tersebut → Lihat detail:**

✅ **Yang BENAR:**
```
General:
  Request URL: http://localhost:4000/api/auth/verify
  Request Method: POST
  Status Code: (Should be 200, 400, 401, dll)

Headers:
  Content-Type: application/json

Payload:
  {
    "signature": "0x...",
    "message": "Sign this message to authenticate...",
    "publicKey": "0x...",
    "address": "0x..."
  }
```

❌ **Yang SALAH:**
```
Request URL: https://api.peridotvault.com/api/auth/verify
  ↑
  INI SALAH! Masih menggunakan production API
```

---

### METODE 3: Cek Environment Variable di Code

#### Tambah Log Sementara

Edit file `src/shared/lib/http.ts`, tambahkan di bagian atas:

```typescript
const API_BASE_URL = process.env.PUBLIC_API_BASE_URL ?? "https://api.peridotvault.com";

// Tambah log ini
console.log('🔍 DEBUG API URL:');
console.log('  env var:', process.env.PUBLIC_API_BASE_URL);
console.log('  final URL:', API_BASE_URL);

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
});
```

Lihat di terminal saat server start, atau di browser console.

---

### METODE 4: Gunakan Verification Script

Jalankan script yang sudah dibuat:

```bash
./scripts/verify-api-connection.sh
```

Output akan menunjukkan:
- ✅ `.env.local` exists
- ✅ API URL yang digunakan
- ✅ Backend running atau tidak
- ✅ Status dev server

---

## 📋 Checklist Verifikasi Lengkap

Centang semua item ini:

### Environment Setup
- [ ] File `.env.local` ada di root directory
- [ ] Isi `.env.local`: `PUBLIC_API_BASE_URL="http://localhost:4000"`
- [ ] Backend running di `http://localhost:4000` (test dengan curl)
- [ ] Next.js cache dihapus: `rm -rf .next`

### Dev Server
- [ ] Dev server **dihentikan** (Ctrl+C)
- [ ] Dev server **dijalankan lagi**: `pnpm dev`
- [ ] Lihat terminal startup untuk log API configuration

### Browser Console
- [ ] Buka `http://localhost:3000`
- [ ] Buka DevTools → Console
- [ ] Refresh halaman (F5)
- [ ] Cari log: `HTTP CLIENT INITIALIZED`
- [ ] Pastikan `Base URL: http://localhost:4000`

### Network Tab
- [ ] Buka DevTools → Network
- [ ] Filter: ketik "auth"
- [ ] Klik "Connect Wallet"
- [ ] Cari request ke `/api/auth/verify`
- [ ] Klik request → lihat "Request URL"
- [ ] Pastikan: `http://localhost:4000/api/auth/verify`

### Test Request
- [ ] Request method: `POST`
- [ ] Request URL: `http://localhost:4000/api/auth/verify`
- [ ] Request body ada: signature, message, publicKey, address
- [ ] Response ada dari backend

---

## 🔧 Troubleshooting

### Problem 1: Masih ke `https://api.peridotvault.com`

**Cause:** Dev server tidak di-restart setelah buat `.env.local`

**Solution:**
```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clear cache
rm -rf .next

# 3. Start lagi
pnpm dev

# 4. Refresh browser (Ctrl+Shift+R - hard refresh)
```

---

### Problem 2: `PUBLIC_API_BASE_URL` is undefined

**Cause:** Next.js tidak membaca `.env.local` dengan benar

**Solution:**
```bash
# Check file exists
ls -la .env.local

# Check content
cat .env.local

# Must be exactly:
PUBLIC_API_BASE_URL="http://localhost:4000"
```

---

### Problem 3: Backend tidak merespon

**Check backend running:**
```bash
# Test backend
curl http://localhost:4000

# Atau buka di browser:
# http://localhost:4000
```

Jika tidak merespon, **start backend dulu!**

---

## 🎯 Quick Verification Command

Jalankan ini untuk memverifikasi semuanya:

```bash
# 1. Check backend
curl -s http://localhost:4000 && echo "✅ Backend Running" || echo "❌ Backend Not Running"

# 2. Check .env.local
cat .env.local | grep PUBLIC_API

# 3. Clear and restart
rm -rf .next && pnpm dev
```

Lalu di browser, buka console dan ketik:

```javascript
// Di browser console, check axios base URL
console.log('API Base URL:', window.location.origin);
```

---

## ✅ Success Indicators

Jika semua benar, Anda akan melihat:

### Di Terminal (saat `pnpm dev`):
```
✓ Ready in 2.3s
◤ Compiling / ...
◤ Compiled / in 1234ms
```

### Di Browser Console:
```
============================================================
🔗 HTTP CLIENT INITIALIZED
============================================================
Base URL: http://localhost:4000    ← MUST BE THIS!
Environment: development
============================================================
```

### Di Network Tab:
```
Request URL: http://localhost:4000/api/auth/verify
Method: POST
Status: 200 OK (or 4xx/5xx from backend)
```

---

## 📞 Masih Tidak Bisa?

Jika setelah semua langkah di atas masih ke `api.peridotvault.com`:

1. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete → Clear "Cached images and files"
   - Atau buka Incognito mode (Ctrl+Shift+N)

2. **Check apakah ada env files lain:**
   ```bash
   ls -la .env*
   # Hapus jika ada .env atau .env.development
   # Keep only .env.local
   ```

3. **Rebuild from scratch:**
   ```bash
   rm -rf .next node_modules
   pnpm install
   pnpm dev
   ```

---

**Created:** 2025-01-15
**Purpose:** Verifikasi API connection ke localhost:4000
**Status:** ✅ Ready for Testing
