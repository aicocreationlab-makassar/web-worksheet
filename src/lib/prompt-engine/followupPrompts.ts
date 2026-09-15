import type { WorksheetForm } from "@/lib/schemas/worksheet";
import { getTheme } from "./buildPrompt";
import { getPersonalization } from "./personalization";
export function getFollowups(d: WorksheetForm) {
  return [
    {
      title: "Buat lebih mudah",
      description: "Soal lebih sederhana dan ruang menjawab lebih besar.",
      icon: "🌱",
      prompt: `Revise ONLY the current ${getTheme(d)} worksheet image for children aged ${d.ageRange === "custom" ? d.customAge : d.ageRange}. Reduce items, simplify instructions and enlarge answer spaces. Preserve the current page number, series design and exact identity. Do not generate the next page or reset the series. Keep the revision limited to this page unless I ask otherwise.`,
    },
    {
      title: "Periksa & perbaiki soal",
      description: "Cek hitungan, tulisan, dan jawaban agar latihannya jelas.",
      icon: "📄",
      prompt:
        "Audit the CURRENT worksheet image for incorrect counts, repeated or missing objects, ambiguous answers, misspellings, unsolvable mazes and mismatched pairs. Regenerate ONLY this same page with corrected content. Preserve its page number, approved characters, palette, layout, language and identity. Leave all child response areas empty. Do not advance to another page.",
    },
    {
      title:
        d.colorMode === "printer-friendly" || d.colorMode === "black-white"
          ? "Jadikan lembar mewarnai"
          : "Versi hemat tinta",
      description: "Ubah menjadi garis hitam putih yang mudah dicetak dan diwarnai.",
      icon: "🖨️",
      prompt:
        "Convert ONLY the current worksheet page into printer-friendly black and white coloring line art. Use bold outlines, white interiors and no grayscale fills. Preserve the learning objective, identity, layout and page number. Do not advance the series or change other pages unless asked.",
    },
    {
      title: "Rapikan ruang jawaban",
      description: "Beri tangan kecil lebih banyak ruang untuk berlatih.",
      icon: "↔️",
      prompt:
        "Revise ONLY the current worksheet. Increase answer spaces, widen gaps between tasks and simplify decoration. Preserve identity, content, current page number, paper size and safe print margins. Do not generate a new page.",
    },
    {
      title:
        d.language === "id"
          ? "Ubah ke bahasa Inggris"
          : "Ubah ke bahasa Indonesia",
      description: "Ganti bahasa petunjuk. Nama dan identitas tetap sama.",
      icon: "🌏",
      prompt: `Translate child-facing instructional text on ONLY the current worksheet into ${d.language === "id" ? "English" : "Bahasa Indonesia"}. Do not translate or alter supplied child names, class names, school names, series title or additional identity. Preserve illustrations, layout, current page number and age-appropriate reading complexity. Keep other pages unchanged.`,
    },
    {
      title: "Pertahankan karakter",
      description: "Selaraskan kembali karakter dan tampilan dengan lembar pertama.",
      icon: "🧸",
      prompt: `Use the approved first worksheet image as the visual reference. Restore its exact character design (${d.characterStyle}), proportions, colors, outlines, typography and page structure on the CURRENT ${getTheme(d)} worksheet page. Do not advance the page number. If the reference image is unavailable, ask for it. ${getPersonalization(d)}`,
    },
  ];
}
