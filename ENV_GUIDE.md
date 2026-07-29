# KyyToAPK ENV Guide - Gak Ribet, No Login

## TL;DR

### Kalau cuma mau coba / demo di laptop:
**Gak usah isi .env sama sekali!** 
Kosongin aja `.env.local` atau hapus file-nya. App otomatis jalan di **MOCK MODE** -> build simulasi 2-5 menit dengan log streaming.

```bash
npm run dev
# buka http://localhost:3000/builder -> klik Build APK -> langsung ada progress bar & download
```

### Kalau mau build APK BENERAN (Real Android SDK compile via GitHub Actions):

Isi **3 aja yang WAJIB:**

| Variable | Wajib? | Cara Isi |
|----------|--------|----------|
| `GITHUB_TOKEN` | **WAJIB** | GitHub.com -> Settings (kanan atas foto) -> Developer settings -> Personal access tokens -> Tokens (classic) -> Generate new token -> centang `repo` + `workflow` -> copy yang `ghp_xxxx` |
| `GITHUB_REPO_OWNER` | **WAJIB** | Username GitHub kamu, contoh: `riskykyy` |
| `GITHUB_REPO_NAME` | **WAJIB** | Nama repo yang ada folder `.github/workflows/build-apk.yml`, contoh: `kyytoapk` |
| `NEXT_PUBLIC_APP_URL` | **RECOMMENDED** | URL app kamu. Local: `http://localhost:3000`, Vercel: `https://kyytoapk.vercel.app` |
| `GITHUB_WORKFLOW_ID` | **OPSIONAL** | Biarin aja `build-apk.yml` kecuali kamu rename file workflow |

## Step by Step Real Build

1. **Push project ini ke GitHub** (repo public/private bebas)
2. **Buat token:**
   - Buka https://github.com/settings/tokens
   - Generate new token (classic)
   - Expire: No expiration atau 90 days
   - Checklist: `repo` (full) + `workflow`
   - Generate -> copy `ghp_...`
3. **Isi .env.local:**
   ```
   GITHUB_TOKEN=ghp_yang-baru-kamu-copy
   GITHUB_REPO_OWNER=username-kamu
   GITHUB_REPO_NAME=kyytoapk
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
4. **Isi di Vercel kalau deploy:**
   - Vercel Dashboard -> Project -> Settings -> Environment Variables
   - Add 4 variable di atas (value sama)
   - `NEXT_PUBLIC_APP_URL` isi dengan domain vercel kamu (https://xxx.vercel.app)
5. **Test:**
   - Buka `/builder` -> isi URL + icon -> Build
   - Cek tab Actions di GitHub repo kamu -> akan muncul workflow `KyyToAPK APK Builder` lagi running
   - Tunggu 2-5 menit -> Artifact APK muncul di Releases + di UI Vercel status jadi `ready`

## Kenapa Butuh GitHub Actions?

Vercel itu serverless, limit 10-60 detik, gak bisa install Android SDK + Gradle (butuh 3-4GB + 5 menit compile). Makanya kita pakai trik:

```
Vercel (Next.js) --workflow_dispatch--> GitHub Actions (Ubuntu runner with Java 17 + Android SDK) --build APK--> Upload ke GitHub Release --webhook PATCH--> Vercel status ready
```

Gratis 2000 menit build per bulan dari GitHub!

## Gak Ada Login?

Betul, sesuai request kamu. Gak ada NextAuth, gak ada Clerk, gak ada database.

- **History My APKs** disimpan di `localStorage` browser (key: `kyy_apks`), max 20 item. Kalau clear cache browser ya hilang.
- Kalau nanti mau upgrade ke Supabase cloud sync, tinggal uncomment di `lib/github-actions-trigger.ts` -> ganti `buildStore` Map jadi Supabase client. Tapi untuk sekarang no-auth = simple.

## Troubleshooting

- **Build not found / 404 di /api/status/[id]:** Wajar kalau di Vercel, karena in-memory store ke-reset pas cold start (serverless). Solusi: refresh dan build lagi, atau nanti upgrade ke Redis/Upstash.
- **GITHUB_TOKEN invalid:** Pastikan token ada prefix `ghp_` dan centang `workflow` scope. Token classic, bukan fine-grained.
- **Workflow tidak ke-trigger:** Cek `GITHUB_REPO_OWNER` dan `GITHUB_REPO_NAME` bener gak, dan repo harus punya file `.github/workflows/build-apk.yml` di branch `main`.

Done! Gasken.
