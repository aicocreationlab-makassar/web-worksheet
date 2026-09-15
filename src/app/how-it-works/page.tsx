import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export const metadata: Metadata = { title: "Cara membuat worksheet" };
export const guideSteps = [
  [
    "Mulai dari si kecil",
    "Pilih tema kesukaan, usia, dan aktivitas. Tentukan 1–20 lembar, lalu pilih gaya dan ukuran kertas yang cocok.",
  ],
  [
    "Beri sentuhan personal, kalau mau",
    "Tambahkan nama anak, kelas, sekolah, atau judul seri. Semuanya opsional dan akan terlihat di ringkasan sebelum prompt dibuat.",
  ],
  ["Buka ChatGPT", "Buka chatgpt.com di tab baru dan mulai percakapan baru."],
  [
    "Salin dan tempel prompt awal",
    "Tekan Salin prompt di halaman hasil. Tempel seluruhnya ke chat baru. Prompt ini sudah menyertakan rencana semua lembar, identitas, dan aturan menjaga gaya.",
  ],
  [
    "Buat gambar pertama",
    "Kirim prompt melalui fitur pembuatan gambar yang tersedia di akunmu. ChatGPT diminta membuat gambar 1 saja, berisi satu worksheet utuh, lalu menunggu perintah berikutnya.",
  ],
  [
    "Periksa hasil worksheet",
    "Cek ejaan, jumlah objek, jawaban yang benar, dan kesesuaian aktivitas sebelum digunakan.",
  ],
  [
    "Cukup ketik “lanjut gambar 2”",
    "Gunakan percakapan yang sama. Lanjutkan dengan “lanjut gambar 3” dan seterusnya sesuai jumlah lembar. Jika hasil perlu diperbaiki, gunakan saran revisi; revisi tidak berpindah ke lembar berikutnya. Jika AI kehilangan konteks, salin instruksi lanjutan lengkap dan sertakan gambar sebelumnya sebagai referensi.",
  ],
  [
    "Unduh dan cetak",
    "Unduh gambar dari ChatGPT. Pilih ukuran kertas sesuai prompt dan periksa pratinjau cetak.",
  ],
];
export default function Page() {
  return (
    <main id="main" className="container page-main narrow-page">
      <div className="center-heading">
        <span className="section-kicker">DARI IDE KE LEMBAR BELAJAR</span>
        <h1>Dari mengenal si kecil, jadi seri belajarnya.</h1>
        <p>Siapkan sekali. Wujudkan di ChatGPT, satu lembar setiap kali.</p>
      </div>
      <div className="guide-list">
        {guideSteps.map(([title, text], i) => (
          <div key={title} className="guide-step">
            <span>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="center-heading">
        <Link prefetch={false} className="button" href="/create">
          Yuk, buat prompt pertama <ArrowUpRight size={18} />
        </Link>
      </div>
    </main>
  );
}
