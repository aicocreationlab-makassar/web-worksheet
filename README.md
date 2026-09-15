# Lembarceria

Website mobile-first untuk merangkai **seri worksheet personal** dengan UI 3D ringan. Pilih tema, usia, aktivitas, jumlah lembar, dan identitas opsional. Lembarceria menghasilkan prompt terstruktur untuk membuat gambar worksheet di ChatGPT satu per satu.

Implementasi mengikuti `PRD.md`, `README_PRODUCT.md`, serta perluasan kebutuhan untuk seri berkelanjutan, personalisasi opsional, dan PWA.

## Menjalankan

Memerlukan Node.js 20.9+ dan npm.

```sh
npm install
npm run dev
```

Buka http://localhost:3000. Tidak membutuhkan API key, database, atau login.

## Produksi / PWA

```sh
npm run build
npm run start
```

Build juga membuat ikon PNG serta service worker dengan manifest aset sesuai build. **PWA dan offline aktif pada build produksi**, melalui HTTPS atau `localhost`; alamat HTTP LAN biasa tidak menyediakan secure context untuk service worker.

Di browser pendukung, gunakan tombol **Pasang aplikasi**. Jika prompt instalasi native belum tersedia, aplikasi menampilkan panduan menu browser dan iPhone/iPad. Setelah precache berhasil, generator, template, panduan, dan riwayat dapat dibuka offline. ChatGPT tetap membutuhkan internet. Pembaruan service worker meminta pengguna menekan **Perbarui**, sehingga halaman tidak dimuat ulang saat sedang mengisi draf.

## Pengujian

```sh
npm test
npx playwright install chromium
npm run test:e2e
```

`test:e2e` otomatis menjalankan server produksi bila port 3000 belum digunakan. Build dahulu sebelum menjalankan E2E. Tetapkan `NEXT_PUBLIC_SITE_URL` ke domain produksi untuk metadata OpenGraph yang benar.

## Fitur

- Landing berbahasa Indonesia, ilustrasi 3D CSS, font lokal dan desain responsif.
- Wizard 5 langkah dengan validasi Zod, pilihan khusus, draf tersimpan, dan navigasi kembali.
- Seri 1–20 lembar (default 5), dengan 19 bagian prompt: profil usia, rencana tiap lembar, mekanisme aktivitas, konsistensi karakter, identitas, tata letak, cetak, dan pemeriksaan mutu.
- Personalisasi opsional: nama anak, kelas/kelompok, sekolah/tempat belajar, judul seri, dan identitas tambahan. Tidak ada identitas yang diwajibkan atau diisi otomatis.
- Editor prompt awal, salin dengan fallback, unduh TXT, pilihan nomor gambar lanjutan, dan instruksi lanjutan lengkap.
- Enam saran revisi yang memperbaiki lembar aktif tanpa memajukan nomor gambar.
- Delapan template, pencarian/kategori, contoh prompt, serta panduan ChatGPT.
- Sepuluh riwayat terakhir di localStorage, termasuk prompt yang diedit dan personalisasi. Data tidak dikirim ke server; identitas ikut tersalin bila pengguna menyalin prompt ke layanan AI. Riwayat lama satu halaman tetap bisa dibuka.
- Hook analytics `lembarceria:analytics` melalui DOM CustomEvent; tanpa provider atau pelacakan eksternal.
- Fokus keyboard, label form, status penyalinan, dukungan reduced motion, serta metadata dan social image.
- PWA dengan manifest, ikon biasa/maskable/Apple, install helper, offline shell, dan navigasi bawah khusus ponsel.

## Cara melanjutkan worksheet

1. Salin prompt awal dan kirim di ChatGPT. Prompt meminta **gambar 1 saja**, lalu berhenti.
2. Tinjau ejaan, hitungan, dan ruang jawaban pada gambar pertama.
3. Di percakapan yang sama, ketik **`lanjut gambar 2`**, lalu `lanjut gambar 3`, sesuai jumlah lembar.
4. Perintah nomor yang sama merevisi lembar itu; perintah di luar jumlah lembar meminta konfirmasi perluasan seri.
5. Jika AI kehilangan konteks, gunakan **instruksi lanjutan lengkap**. Saat berpindah chat, sertakan gambar sebelumnya sebagai referensi visual.

Nomor gambar di halaman hasil merupakan pilihan pengguna, bukan bukti bahwa gambar sudah dibuat. Instruksi lengkap diturunkan dari konfigurasi awal; sesuaikan jika prompt utama telah diedit manual. Konsistensi visual diarahkan melalui prompt dan referensi, bukan dijamin oleh API gambar karena aplikasi ini tidak menjalankan generator gambar secara langsung.

## Struktur

```text
src/app/                  Halaman Next.js App Router dan design tokens
src/components/           Layout, landing, generator, hasil, komponen visual
src/data/                 Opsi dan template
src/lib/prompt-engine/    Penyusun prompt dan aturan terpisah
src/lib/schemas/          Model serta validasi form
src/store/               Zustand dan persistensi lokal yang menangani error
src/components/pwa/      Instalasi, status offline, dan notifikasi pembaruan
scripts/                 Ekspor ikon, build service worker, dan audit
tests/unit/              Aturan usia, aktivitas, prompt, followup, validasi
tests/e2e/               Alur pengguna, clipboard, unduhan, riwayat, responsivitas
```

## Catatan produk

Jumlah aktivitas dibatasi profil usia. Aktivitas mewarnai mengesampingkan warna dan shading agar menghasilkan garis hitam pada bidang putih. Instruksi teknis prompt memakai bahasa Inggris; semua teks worksheet mengikuti pilihan Bahasa Indonesia atau English. Ilustrasi contoh bukan keluaran AI. Hasil gambar dari layanan AI tetap perlu diperiksa ejaan, hitungan, dan ketercetakannya.

Data hanya tersimpan pada browser saat ini. Menghapus data browser menghapus draf dan riwayat. Instalasi PWA pada beberapa platform dapat memakai penyimpanan terpisah dari tab browser. Saat penyimpanan atau clipboard diblokir, aplikasi menampilkan pesan serta menyediakan pengeditan/pengunduhan sebagai alternatif.
