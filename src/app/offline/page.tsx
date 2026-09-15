import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tetap berkarya saat offline",
  robots: { index: false, follow: false },
};
export default function Offline() {
  return (
    <main id="main" className="container page-main empty-state">
      <span aria-hidden="true">🌱</span>
      <h1>Internet istirahat, ide tetap jalan.</h1>
      <p>
        Buka generator untuk merangkai prompt atau lanjutkan ide yang tersimpan
        di riwayat.
      </p>
      <div className="offline-actions">
        <Link prefetch={false} href="/create" className="button">
          Buat worksheet
        </Link>
        <Link prefetch={false} href="/history" className="text-button">
          Buka riwayat
        </Link>
      </div>
      <p className="preview-note">
        Buka ChatGPT untuk membuat gambar setelah kembali terhubung.
      </p>
    </main>
  );
}
