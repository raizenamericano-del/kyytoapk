# KyyToAPK v2.2 KV REDIS - FULL PERSISTENT, ANTI STUCK SELAMANYA

## Bedanya v2.1 vs v2.2?

v2.1 (previous zip) masih pakai memory + fallback GitHub Release.
- Kalau Vercel cold start -> memory hilang -> harus fallback cek Release (ada delay 2-3 detik)
- Masih bisa 404 kalau build baru banget & belum jadi release

v2.2 KV:
- Pakai Vercel KV (Upstash Redis) -> data simpan di database luar, bukan di RAM server
- Mau server mati nyala 100x pun data tetep ada
- Gak pernah 404 lagi kalau KV udah connect
- History My APKs bisa jadi cloud sync nanti, bukan cuma localStorage

## Cara Setup KV (Wajib buat v2.2 biar full work)

1. Vercel Dashboard > Pilih project kyytoapk.vercel.app > Tab **Storage** (di atas, sebelah Settings)
2. Klik **Create Database** -> Pilih **KV** (Upstash Redis)
3. Name: `kyytoapk-kv` atau `kyy-kv`
4. Region: Singapore (HKG1) biar deket Indonesia -> Create
5. Di halaman KV, klik **Connect to Project** -> pilih `kyytoapk` -> Connect
6. Vercel otomatis tambahin ENV baru:
   - KV_URL
   - KV_REST_API_URL
   - KV_REST_API_TOKEN
   - KV_REST_API_READ_ONLY_TOKEN
7. Sekarang tambahin juga 5 ENV GitHub yang tadi (kalau belum):
   - GITHUB_TOKEN=ghp_xxx
   - GITHUB_REPO_OWNER=raizenamericano-del
   - GITHUB_REPO_NAME=kyytoapk
   - GITHUB_WORKFLOW_ID=build-apk.yml
   - NEXT_PUBLIC_APP_URL=https://kyytoapk.vercel.app

8. Deployments > Redeploy.

Done! Sekarang cek /api/build-apk GET harusnya ada `"kv": true`

## Tanpa KV apakah tetap jalan?

YA, tetap jalan! Code v2.2 punya fallback:
- Kalau KV_REST_API_URL belum ada, dia otomatis fallback ke memory (kayak v2.1)
- Jadi di local `npm run dev` tanpa KV tetap bisa mock build
- Tapi di production Vercel sangat disarankan pakai KV biar anti stuck selamanya

## Install & Push

```
npm install   // akan install @vercel/kv 1.0.1

git add .
git commit -m "feat v2.2 KV redis persistent - anti stuck forever"
git push origin main
```

## Test

1. Build di /builder
2. Buka tab lain -> /api/status/kyy_xxx -> harus tetap ada walau refresh banyak kali
3. Dulu v2.0 kalau refresh 2x langsung 404, sekarang dengan KV gak akan 404 lagi
4. Download APK REAL dari GitHub Releases (kalau sudah set GITHUB_TOKEN)

## Cost

Vercel KV Free:
- 10.000 commands / hari
- 256 MB storage
- 1.000.000 monthly read
Cukup untuk 1000 build per hari. Kalau lebih, upgrade $0.20 per 100k commands.

Selesai!
