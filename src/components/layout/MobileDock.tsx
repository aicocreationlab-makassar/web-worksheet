"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Sparkles, History } from "lucide-react";
export function MobileDock() {
  const path = usePathname();
  if (path === "/create" || path === "/result") return null;
  return (
    <nav className="mobile-dock" aria-label="Navigasi cepat">
      {[
        { href: "/", label: "Beranda", icon: Home },
        { href: "/templates", label: "Template", icon: Layers },
        { href: "/create", label: "Buat baru", icon: Sparkles },
        { href: "/history", label: "Riwayat", icon: History },
      ].map(({ href, label, icon: Icon }) => (
        <Link
          prefetch={false}
          key={href}
          href={href}
          className={`${path === href ? "selected " : ""}${href === "/create" ? "dock-create" : ""}`}
          aria-current={path === href ? "page" : undefined}
        >
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
