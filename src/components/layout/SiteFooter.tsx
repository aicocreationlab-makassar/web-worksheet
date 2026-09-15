import Link from "next/link";
import { Heart } from "lucide-react";
import { Logo } from "./SiteHeader";
export function SiteFooter() {
  return (
    <footer className="site-footer container">
      <div>
        <Logo />
        <p>Ide kecil, petualangan belajar yang besar.</p>
      </div>
      <div className="footer-links">
        <Link prefetch={false} href="/templates">
          Template
        </Link>
        <Link prefetch={false} href="/how-it-works">
          Cara kerja
        </Link>
        <Link prefetch={false} href="/history">
          Riwayat
        </Link>
      </div>
      <span className="footer-note">
        Dibuat dengan <Heart size={13} /> untuk rasa ingin tahu.
      </span>
    </footer>
  );
}
