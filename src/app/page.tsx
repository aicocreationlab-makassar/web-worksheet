import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  MousePointer2,
  Printer,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { HeroArt } from "@/components/ui/WorksheetArt";
import { TemplateCard } from "@/components/landing/TemplateCard";
import { templates } from "@/data/templates";
import { InstallCard } from "@/components/pwa/PWAProvider";
const faqs = [
  [
    "Bagaimana cara membuat lembar berikutnya?",
    "Salin prompt awal ke ChatGPT untuk membuat gambar 1. Setelah hasilnya sesuai, ketik “gambar 2” di percakapan yang sama. Lanjutkan sesuai jumlah lembar yang kamu pilih. Setiap gambar berisi satu worksheet dengan latihan baru.",
  ],
  [
    "Bisa pakai nama anak dan identitas sendiri?",
    "Bisa. Nama anak, kelas, sekolah, judul seri, dan identitas tambahan bersifat opsional. Isi hanya yang ingin dicetak. Pilihan ini dimasukkan ke prompt agar identitas tetap sama di setiap lembar.",
  ],
  [
    "Apakah Lembarceria membuat gambar worksheet?",
    "Lembarceria membuat prompt terstruktur. Salin prompt tersebut ke ChatGPT atau AI image generator pilihanmu untuk membuat gambar worksheet.",
  ],
  [
    "Apakah bisa dipakai secara gratis?",
    "Ya. Kamu bisa merangkai prompt, menggunakan template, dan membuat seri worksheet secara gratis tanpa login. Pembuatan gambar di ChatGPT mengikuti fitur dan ketentuan akun yang kamu gunakan.",
  ],
  [
    "Untuk anak usia berapa?",
    "Generator mendukung usia 3–12 tahun. Instruksi, jumlah aktivitas, dan ukuran elemen otomatis menyesuaikan rentang usia yang kamu pilih.",
  ],
  [
    "Bisa membuat worksheet hitam-putih?",
    "Bisa. Pilih mode Hitam-putih atau Hemat tinta di langkah gaya visual. Prompt akan meminta garis yang jelas, latar putih, dan penggunaan tinta yang ringan.",
  ],
  [
    "Di mana riwayat prompt saya disimpan?",
    "Riwayat 10 prompt terakhir dan draf disimpan di browser perangkat ini. Tidak perlu akun. Menghapus data browser akan menghapus riwayat tersebut.",
  ],
  [
    "Bisa dipakai seperti aplikasi di HP?",
    "Bisa. Pilih Pasang aplikasi atau tambahkan Lembarceria ke layar utama melalui menu browser. Setelah aplikasi siap offline, generator dan riwayat bisa digunakan tanpa internet. Membuat gambar di ChatGPT tetap membutuhkan koneksi.",
  ],
];
export default function Home() {
  return (
    <main id="main">
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span>✦</span> CERITA BELAJAR, KHUSUS UNTUKNYA
            </div>
            <h1>
              Worksheet seru.
              <br />
              Dibuat lebih mudah.
              <br />
              <span className="hero-highlight">
                Khusus si kecil.
                <svg viewBox="0 0 400 16" aria-hidden="true">
                  <path d="M3 11Q185 -2 395 8" />
                </svg>
              </span>
            </h1>
            <p>
              Pilih kesukaannya, sesuaikan usianya, tambahkan namanya. Kami
              rangkai prompt untuk satu seri worksheet personal. Buat di
              ChatGPT, lalu lanjutkan lembar demi lembar.
            </p>
            <div className="hero-actions">
              <Link prefetch={false} href="/create" className="button">
                <WandSparkles size={19} /> Buat worksheet gratis{" "}
                <ArrowUpRight size={19} />
              </Link>
              <Link prefetch={false} href="/examples" className="text-button">
                Lihat contoh <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-checks">
              <span>
                <Check /> Gratis, tanpa login
              </span>
              <span>
                <Check /> Siap untuk ChatGPT
              </span>
              <span>
                <Check /> Bisa pakai nama anak
              </span>
            </div>
            <div className="hero-community">
              <div className="avatar-stack" aria-hidden="true">
                <span>👩🏻</span>
                <span>👨🏽</span>
                <span>👩🏽‍🏫</span>
                <span>👩🏼</span>
              </div>
              <div>
                <div className="tiny-stars" aria-label="Bintang dekoratif">
                  ✦ ✦ ✦ ✦ ✦
                </div>
                <p>Untuk orang tua yang peduli, guru yang menginspirasi.</p>
              </div>
            </div>
          </div>
          <HeroArt />
        </div>
        <div className="container benefit-strip">
          <div>
            <span className="benefit-icon lavender">
              <Sparkles />
            </span>
            <span>
              <strong>Sesuai tumbuh kembang</strong>
              <small>Aktivitas pas untuk setiap usia</small>
            </span>
          </div>
          <div>
            <span className="benefit-icon peach">
              <Printer />
            </span>
            <span>
              <strong>Cantik di layar, rapi di kertas</strong>
              <small>Dirancang agar siap dicetak</small>
            </span>
          </div>
          <div>
            <span className="benefit-icon mint">
              <Heart />
            </span>
            <span>
              <strong>Kenal namanya, ikut kesukaannya</strong>
              <small>Personalisasi setiap lembar, kalau kamu mau</small>
            </span>
          </div>
        </div>
      </section>
      <section className="section container template-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">MULAI DARI YANG KAMU SUKA</span>
            <h2>
              Mulai dari kesukaan si kecil{" "}
              <span className="heading-spark">✧</span>
            </h2>
            <p>
              Pilih inspirasi, beri sentuhan personal, kembangkan jadi satu
              seri.
            </p>
          </div>
          <Link prefetch={false} className="text-button" href="/templates">
            Jelajahi semua template <ArrowRight size={17} />
          </Link>
        </div>
        <div className="template-grid">
          {templates.slice(0, 4).map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
        <p className="preview-note">
          Ilustrasi contoh aktivitas. Hasil gambar dibuat melalui AI pilihanmu.
        </p>
      </section>
      <section className="container series-showcase">
        <div>
          <span className="section-kicker">
            SATU PROMPT. CERITA BELAJAR BERLANJUT.
          </span>
          <h2>
            Sudah jadi satu?
            <br />
            Besok masih ada yang seru.
          </h2>
          <p>
            Siapkan 1–20 lembar dengan satu tema. Prompt merencanakan latihan
            baru di setiap halaman dan meminta gaya serta identitas tetap
            konsisten.
          </p>
          <div className="showcase-command">
            <span>Ketik di chat yang sama</span>
            <code>gambar 2</code>
            <span>sesederhana itu.</span>
          </div>
          <Link prefetch={false} href="/create" className="text-button">
            Buat seri untuk si kecil <ArrowRight size={16} />
          </Link>
        </div>
        <div
          className="series-stack"
          aria-label="Contoh tiga lembar worksheet personal untuk Alya"
        >
          <div className="series-mini-sheet sheet-three">
            <span>LEMBAR 3</span>
            <h3>Aku bisa berhitung!</h3>
            <p>Alya · TK B</p>
            <div>🐢 🐢 🐢</div>
            <i>2 &nbsp; 3 &nbsp; 4</i>
          </div>
          <div className="series-mini-sheet sheet-two">
            <span>LEMBAR 2</span>
            <h3>Hitung teman baru</h3>
            <p>Alya · TK B</p>
            <div>🐳 🐳</div>
            <i>1 &nbsp; 2 &nbsp; 3</i>
          </div>
          <div className="series-mini-sheet sheet-one">
            <span>LEMBAR 1</span>
            <h3>Petualangan laut Alya</h3>
            <p>Alya · TK B</p>
            <div>🐠 🐠 🐠</div>
            <i>1 &nbsp; 2 &nbsp; 3</i>
          </div>
          <span className="personal-sticker">💛 Dibuat khusus untuk Alya</span>
          <small>Ilustrasi personalisasi, bukan hasil AI.</small>
        </div>
      </section>
      <section className="how-section">
        <div className="container">
          <div className="center-heading">
            <span className="section-kicker">SESEDERHANA SATU, DUA, TIGA</span>
            <h2>Lebih dekat dengan si kecil. Lebih ringan persiapannya.</h2>
            <p>
              Lebih sedikit mikir teknis, lebih banyak waktu belajar bersama.
            </p>
          </div>
          <div className="how-grid">
            {[
              {
                icon: <MousePointer2 />,
                n: "01",
                color: "peach",
                title: "Kenali penjelajah kecilmu",
                text: "Pilih tema kesukaannya, usia, dan aktivitas. Tambahkan nama atau judul personal jika mau.",
              },
              {
                icon: <WandSparkles />,
                n: "02",
                color: "lavender",
                title: "Wujudkan lembar pertama",
                text: "Atur jumlah lembar dan gaya. Salin prompt yang sudah lengkap ke ChatGPT untuk membuat gambar 1.",
              },
              {
                icon: <Sparkles />,
                n: "03",
                color: "mint",
                title: "Lanjutkan petualangannya",
                text: "Ketik “gambar 2” di chat yang sama. Periksa hasil, unduh, lalu nikmati waktu belajar bersama.",
              },
            ].map((x) => (
              <div className="how-card" key={x.n}>
                <span className={`how-icon ${x.color}`}>{x.icon}</span>
                <span className="how-number">{x.n}</span>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container why-section">
        <div className="why-art" aria-hidden="true">
          <span className="why-book">📚</span>
          <span className="why-star">✦</span>
          <span className="why-heart">💛</span>
          <span className="why-label">Rasa ingin tahu dimulai dari sini.</span>
        </div>
        <div>
          <span className="section-kicker">BUKAN SEKADAR PROMPT BIASA</span>
          <h2>
            Dipikirkan dengan teliti.
            <br />
            Dibuat untuk si kecil.
          </h2>
          <p>
            Di balik setiap pilihan sederhana, ada detail yang membantu
            worksheet-mu jadi lebih baik.
          </p>
          <ul className="why-list">
            <li>
              <ShieldCheck />
              <span>
                <strong>Selalu sesuai usia</strong>
                <small>
                  Instruksi, jumlah soal, dan ukuran objek ikut menyesuaikan.
                </small>
              </span>
            </li>
            <li>
              <Printer />
              <span>
                <strong>Ruang belajar yang lega</strong>
                <small>
                  Margin rapi, tulisan terbaca, dan area jawaban yang cukup.
                </small>
              </span>
            </li>
            <li>
              <Sparkles />
              <span>
                <strong>Gampang dikembangkan lagi</strong>
                <small>
                  Perintah singkat untuk lembar baru, revisi, dan hasil yang
                  makin personal.
                </small>
              </span>
            </li>
          </ul>
        </div>
      </section>
      <section className="section container faq-section">
        <div>
          <span className="section-kicker">MASIH PENASARAN?</span>
          <h2>
            Pertanyaan kecil,
            <br />
            jawaban di sini.
          </h2>
          <p>Kenalan lebih dekat dengan Lembarceria.</p>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <ChevronDown size={18} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="container final-cta">
        <span className="cta-star" aria-hidden="true">
          ✦
        </span>
        <span className="section-kicker">YUK, MULAI SESUATU YANG SERU</span>
        <h2>
          Untuk senyum kecilnya.
          <br />
          Untuk waktu bersama.
        </h2>
        <p>Buat seri worksheet yang mengenal nama dan kesukaannya.</p>
        <Link prefetch={false} href="/create" className="button">
          <WandSparkles size={18} /> Buat worksheet untuknya{" "}
          <ArrowUpRight size={18} />
        </Link>
        <span className="cta-flower" aria-hidden="true">
          ✿
        </span>
      </section>
      <InstallCard />
    </main>
  );
}
