import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PWAProvider } from "@/components/pwa/PWAProvider";
import { MobileDock } from "@/components/layout/MobileDock";
const nunito = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/nunito/files/nunito-latin-700-normal.woff2",
      weight: "700",
    },
    {
      path: "../../node_modules/@fontsource/nunito/files/nunito-latin-800-normal.woff2",
      weight: "800",
    },
    {
      path: "../../node_modules/@fontsource/nunito/files/nunito-latin-900-normal.woff2",
      weight: "900",
    },
  ],
  variable: "--font-nunito",
  display: "swap",
  preload: true,
});
const dmSans = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff2",
      weight: "600",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});
export const metadata: Metadata = {
  applicationName: "Lembarceria",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lembarceria",
  },
  icons: { apple: "/icons/apple-touch-icon.png" },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Lembarceria — Worksheet personal, belajar jadi seru",
    template: "%s | Lembarceria",
  },
  description:
    "Buat seri worksheet personal untuk si kecil. Pilih tema, usia, dan nama opsional; lanjutkan lembar demi lembar di ChatGPT. Gratis, tanpa login, bisa dipasang di HP.",
  openGraph: {
    title: "Lembarceria — Worksheet personal untuk si kecil",
    description:
      "Satu ide, satu seri worksheet. Personalisasi untuk si kecil, lalu lanjut gambar berikutnya dengan perintah singkat.",
    locale: "id_ID",
    type: "website",
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#28784f",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${nunito.variable} ${dmSans.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Langsung ke konten
        </a>
        <PWAProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <MobileDock />
        </PWAProvider>
      </body>
    </html>
  );
}
