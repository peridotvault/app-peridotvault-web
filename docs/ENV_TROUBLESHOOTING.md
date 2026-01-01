# 🔧 Troubleshooting: Masalah Environment Variables

## Problem: Kenapa yang diakses `https://api.peridotvault.com`?

### Penyebab:

Next.js **tidak otomatis membaca** perubahan environment variables saat dev server sedang running. Environment variables hanya dibaca **saat server start**.

Jadi ketika Anda membuat `.env.local`, dev server yang sudah running tidak tahu tentang file tersebut dan tetap menggunakan fallback value: `https://api.peridotvault.com`

---

## ✅ Solution: Restart Dev Server

### Langkah 1: Stop Dev Server
```bash
# Tekan Ctrl+C di terminal where dev server running
# Atau kill process:
pkill -f "next dev"
```

### Langkah 2: Verify Environment Variable
```bash
cat .env.local | grep PUBLIC_API
# Harus menunjukkan: PUBLIC_API_BASE_URL="http://localhost:4000"
```

### Langkah 3: Start Dev Server Lagi
```bash
pnpm dev
```

### Langkah 4: Verify di Browser
1. Buka DevTools → Network tab
2. Klik "Connect Wallet"
3. Lihat request yang dibuat:
   - ✅ **Benar:** `http://localhost:4000/api/auth/verify`
   - ❌ **Salah:** `https://api.peridotvault.com/api/auth/verify`

---

## 🔍 Cara Cek Environment Variable Terbaca

### Method 1: Check di Browser Console

Buka browser console dan ketik:
```javascript
console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
```

**Expected output:** `http://localhost:4000`

Jika `undefined` atau tidak muncul sama sekali, berarti env var tidak terbaca.

### Method 2: Check dengan Script

```bash
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.PUBLIC_API_BASE_URL)"
```

### Method 3: Tambah Log di Code

Temporari tambahkan log di `src/shared/lib/http.ts`:

```typescript
const baseURL = process.env.PUBLIC_API_BASE_URL ?? "https://api.peridotvault.com";
console.log('🔗 API Base URL:', baseURL); // ← Add this
```

Lihat di terminal saat server start.

---

## 🐛 Common Issues & Solutions

### Issue 1: Environment Variable Not Loaded

**Symptoms:**
- Request tetap ke `https://api.peridotvault.com`
- `process.env.PUBLIC_API_BASE_URL` returns `undefined`

**Solutions:**

#### A. Check File Name
File harus bernama **`.env.local`** (bukan `.env` atau `.env.example`):
```bash
ls -la .env*
# Harus ada: .env.local
```

#### B. Check File Location
File harus di **root directory** (same level as `package.json`):
```bash
pwd
# Should be: /home/xmuu/Dev/peridot/app-peridotvault-web
ls .env.local
# Should exist
```

#### C. Check File Format
Pastikan format benar (no extra spaces):
```bash
# ✅ CORRECT:
PUBLIC_API_BASE_URL="http://localhost:4000"

# ❌ WRONG (spaces around =):
PUBLIC_API_BASE_URL = "http://localhost:4000"

# ❌ WRONG (missing quotes):
PUBLIC_API_BASE_URL=http://localhost:4000
```

#### D. Restart Server
**PENTING:** Next.js hanya baca env vars saat startup!
```bash
# STOP dev server (Ctrl+C)
# Then start again:
pnpm dev
```

---

### Issue 2: TypeScript Cache

**Symptoms:**
- Environment variable sudah benar
- Tapi tetap menggunakan old value

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
pnpm dev
```

---

### Issue 3: Multiple Environment Files

**Symptoms:**
- Confusing which env file is being used

**Priority Order** (highest to lowest):
1. `.env.local` ← **USE THIS for local development**
2. `.env.development`
3. `.env`
4. `.env.example`

**Recommendation:** Hapus env files lain, hanya keep `.env.local`:
```bash
# Keep only .env.local
rm .env .env.development  # If they exist
```

---

### Issue 4: Wrong Environment Variable Name

**Symptoms:**
- Env var tidak terbaca

**Check:** Pastikan menggunakan `PUBLIC_API_BASE_URL` (bukan `NEXT_PUBLIC_`):
```typescript
// ✅ CORRECT in code:
process.env.PUBLIC_API_BASE_URL

// ❌ WRONG (no NEXT_PUBLIC_ prefix needed for client-side):
process.env.NEXT_PUBLIC_API_BASE_URL
```

**Note:** Di Next.js App Router, env vars dengan `PUBLIC_` prefix otomatis available di client-side.

---

## ✅ Verification Checklist

Sebelum test connection, verify:

- [ ] `.env.local` exists in root directory
- [ ] `.env.local` contains: `PUBLIC_API_BASE_URL="http://localhost:4000"`
- [ ] Dev server has been **restarted** after creating `.env.local`
- [ ] Backend is running on port 4000
- [ ] Check with `curl http://localhost:4000` responds
- [ ] Next.js cache cleared: `rm -rf .next`
- [ ] Dev server freshly started: `pnpm dev`

---

## 🧪 Quick Test

Setelah restart dev server, test ini:

### 1. Check Browser Console
```javascript
// Open browser console and run:
console.log('API URL:', window.location.origin);
// Then try connect wallet and check Network tab
```

### 2. Check Network Request

Setelah klik "Connect Wallet":
- Open **DevTools → Network**
- Filter by "auth"
- Click the request
- Check **Request URL**:
  - Should be: `http://localhost:4000/api/auth/verify`
  - Should NOT be: `https://api.peridotvault.com/api/auth/verify`

### 3. Check Request Headers

Click request → **Headers** tab:
```
Request URL: http://localhost:4000/api/auth/verify
Method: POST
Content-Type: application/json
```

---

## 🚀 Permanent Fix

Untuk menghindari masalah ini di masa depan:

### Option 1: Add to package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:local": "next dev -p 3000",
    "dev:check": "node scripts/check-env.js && next dev"
  }
}
```

Use: `pnpm dev:check`

### Option 2: Add Pre-start Check

Create `.env.local` if not exists:

```bash
# .env.local
PUBLIC_API_BASE_URL="http://localhost:4000"
PORT=3000
NODE_ENV=development
```

---

## 📝 Summary

**Problem:** Request ke `https://api.peridotvault.com` instead of `http://localhost:4000`

**Root Cause:** Environment variable not loaded because dev server wasn't restarted

**Solution:**
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Verify .env.local exists and is correct
# 3. Clear cache: rm -rf .next
# 4. Start dev server: pnpm dev
# 5. Test in browser
```

**Prevention:** Always restart dev server after changing `.env.local`

---

**Last Updated:** 2025-01-15
**Issue:** Environment variables not loading
**Status:** ✅ Fixed (requires restart)
