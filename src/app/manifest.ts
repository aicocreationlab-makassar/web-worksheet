import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Lembarceria — Worksheet untuk si kecil",
    short_name: "Lembarceria",
    description:
      "Rangkai seri worksheet personal, lanjut gambar berikutnya, dan simpan ide belajar di perangkatmu.",
    lang: "id",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#fdfcf8",
    theme_color: "#28784f",
    orientation: "any",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["education", "productivity"],
    shortcuts: [
      {
        name: "Buat worksheet",
        short_name: "Buat",
        url: "/create",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Riwayat worksheet",
        short_name: "Riwayat",
        url: "/history",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
