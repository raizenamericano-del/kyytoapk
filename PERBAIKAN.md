# 🔧 PERBAIKAN — KyyToAPK Build Engine

Tanggal: 2026-07-29

## Apa yang gagal?
Build APK di GitHub Actions selalu "gagal" / release kosong (tidak ada file `.apk`).
Penyebabnya **bukan** di web-nya (Next.js build sukses), tapi di workflow
`.github/workflows/build-apk.yml`.

## Akar masalah
1. **Build Gradle GAGAL diam-diam.** Project Android memakai dependency AndroidX
   (`androidx.appcompat`, `com.google.android.material`, `androidx.swiperefreshlayout`),
   tetapi tidak punya `gradle.properties` berisi `android.useAndroidX=true`.
   AGP memunculkan error:
   > *This project uses AndroidX dependencies, but the 'android.useAndroidX' property is not enabled.*
2. Error itu **disembunyikan** oleh `|| true` di akhir command build, jadi langkah
   "Build APK" terlihat sukses padahal **tidak ada APK** yang dihasilkan.
3. Release lalu dibuat **kosong** (assets `[]`) → link download mati → app nampak "gagal".

## Yang diperbaiki (hanya yang perlu, tidak mengubah perilaku app)
Hanya **1 file** yang diubah: `.github/workflows/build-apk.yml`

1. ✅ Menambahkan pembuatan `gradle.properties` berisi:
   - `android.useAndroidX=true`
   - `android.enableJetifier=true`
   - pengaturan memori/performa Gradle
2. ✅ Mengganti action deprecated `gradle/gradle-build-action@v2`
   → `gradle/actions/setup-gradle@v4` (action lama sudah diarsipkan).
3. ✅ Langkah "Build APK" tidak lagi menyembunyikan error (`|| true` dihapus),
   dan kini **gagal dengan jelas** jika tidak ada APK yang dihasilkan — jadi
   kalau ada masalah lain di masa depan, langsung terlihat di log Actions.

## Cara menerapkan
**Opsi A — paling cepat:** unzip, lalu `git push` ke repo kamu.
**Opsi B:** cukup ganti file `.github/workflows/build-apk.yml` di repo kamu
dengan versi yang ada di zip ini, lalu commit & push.

Setelah push, coba trigger build lagi dari app — APK akan benar-benar terbangun
dan muncul sebagai asset di GitHub Releases.
