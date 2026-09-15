import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container empty-state page-main">
      <span>🧭</span>
      <h1>Ups, kita sedikit tersesat.</h1>
      <p>Halaman ini belum ada. Petualangan belajarnya masih menunggu!</p>
      <Link prefetch={false} href="/" className="button">
        Kembali ke beranda
      </Link>
    </main>
  );
}
