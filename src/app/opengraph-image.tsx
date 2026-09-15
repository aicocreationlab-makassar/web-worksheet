import { ImageResponse } from "next/og";
export const alt = "Lembarceria — Worksheet personal untuk si kecil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#f8f8ef",
        padding: 80,
        color: "#244735",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 40 }}>lembarceria.</div>
      <div style={{ fontSize: 76, fontWeight: 800 }}>Worksheet seru.</div>
      <div style={{ fontSize: 80, fontWeight: 800, color: "#2b8152" }}>
        Khusus si kecil.
      </div>
      <div style={{ fontSize: 28, marginTop: 30 }}>
        Seri personal · Lanjut gambar berikutnya · Gratis
      </div>
    </div>,
    size,
  );
}
