import type { WorksheetForm } from "@/lib/schemas/worksheet";
export function getPrintRules(data: WorksheetForm) {
  const sizes = {
    A4: "A4 (210 × 297 mm)",
    "US Letter": "US Letter (8.5 × 11 inches)",
    square: "square (210 × 210 mm)",
    custom: data.customPaperSize,
  };
  return `${sizes[data.paperSize]}, ${data.orientation} orientation, identical across the series. Each individual image must show exactly one flat printable page, straight-on, at high resolution suitable for 300 DPI printing. Keep all content within at least 12 mm safe margins. Preserve the selected aspect ratio. White background; no bleed, cropped edges, mockup, desk background, browser frame or hands holding the page. If exact resolution is unavailable, use the highest available resolution without changing the aspect ratio. Never combine multiple worksheet pages into a single image.`;
}
