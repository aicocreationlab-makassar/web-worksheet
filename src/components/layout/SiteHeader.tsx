"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X, Sparkles, History } from "lucide-react";
export function Logo() {
  return (
    <Link
      prefetch={false}
      className="logo"
      href="/"
      aria-label="Lembarceria beranda"
    >
      <span className="logo-icon">
        <span />
        <span />
        <span />
      </span>
      <span>
        lembar<span className="green-text">ceria</span>
        <span className="logo-dot">.</span>
      </span>
    </Link>
  );
}
export function SiteHeader() {
  const path = usePathname(),
    [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Logo />
        <nav
          className={open ? "main-nav open" : "main-nav"}
          aria-label="Navigasi utama"
        >
          {[
            ["/", "Beranda"],
            ["/templates", "Template"],
            ["/how-it-works", "Cara kerja"],
          ].map(([href, label]) => (
            <Link
              prefetch={false}
              key={href}
              href={href}
              className={path === href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            prefetch={false}
            href="/history"
            className={
              path === "/history" ? "active history-link" : "history-link"
            }
            onClick={() => setOpen(false)}
          >
            <History size={16} /> Riwayat
          </Link>
        </nav>
        <Link
          prefetch={false}
          href="/create"
          className="button button-small nav-cta"
        >
          <Sparkles size={16} /> Buat worksheet <ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-button"
          aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
