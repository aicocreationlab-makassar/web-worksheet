# Verifikasi MVP Lembarceria

Tanggal: 15 September 2026. Pengujian menggunakan build produksi Next.js, Node.js 24, dan Chromium melalui Playwright pada Windows.

## Hasil

- `npm run build`: lulus, seluruh halaman berhasil diprerender.
- `npm test`: 36 tes lulus.
- `npm run test:e2e`: 7 tes lulus.
- Lebar layar 360, 390, 430, dan 1440 piksel: semua rute publik yang diuji bebas overflow horizontal.
- Axe WCAG 2 A/AA dan WCAG 2.1 AA: tidak ada temuan serius/kritis pada landing, seluruh langkah wizard mobile, dan hasil prompt terisi.
- Tidak ada error JavaScript pada alur mobile dan navigasi keyboard yang diuji.

## Alur yang diuji

1. Landing → pilih tema → usia → aktivitas → gaya → tinjau → buat prompt.
2. Pilihan wajib dan tema khusus kosong ditolak sebelum melanjutkan.
3. Tombol kembali mempertahankan pilihan; draf biasa dan draf dari template bertahan setelah refresh.
4. Prompt memuat pilihan pengguna, dapat diedit, disalin, dan diunduh sebagai TXT.
5. Prompt lanjutan dapat disalin; tautan ChatGPT membuka tujuan yang benar.
6. Riwayat memulihkan hasil beserta editannya dan bertahan setelah refresh.
7. Pencarian template menyaring hasil dan template mengisi wizard dengan benar.
8. Browser yang memblokir penyimpanan tetap dapat melanjutkan generator.
9. Clipboard yang diblokir menampilkan panduan penyalinan manual.
10. Seluruh langkah wizard dan hasil terisi tetap muat pada ponsel; tombol pilihan dapat digunakan dengan keyboard; reduced motion dihormati.

## Artefak visual

- `artifacts/home-desktop.png`
- `artifacts/home-mobile.png`
- `artifacts/generator-desktop.png`
- `artifacts/result-desktop.png`
- `artifacts/result-mobile.png`

Audit aksesibilitas terperinci dapat dijalankan ulang setelah server aktif:

```sh
node scripts/audit-accessibility.mjs
```

Hasil pemeriksaan ini berlaku untuk browser dan alur di atas. Aplikasi menghasilkan prompt secara lokal; kualitas gambar yang kemudian dibuat oleh layanan AI berada di luar pengujian aplikasi ini.
