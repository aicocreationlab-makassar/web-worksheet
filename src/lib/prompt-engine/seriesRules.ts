import type { WorksheetForm } from "@/lib/schemas/worksheet";
import { getAgeRules, getTaskCount } from "./ageRules";
import { labelOf, themes } from "@/data/options";

export type SeriesPage = {
  number: number;
  title: string;
  focus: string;
  instruction: string;
};
const progressions: Record<string, string[]> = {
  tracing: [
    "Garis pertama",
    "Bentuk dan arah",
    "Pola garis baru",
    "Jejak bertema",
    "Aku bisa menebalkan",
  ],
  coloring: [
    "Kenalan dengan bentuk",
    "Teman baru untuk diwarnai",
    "Detail sederhana",
    "Cerita kecil penuh warna",
    "Warna pilihanku",
  ],
  matching: [
    "Temukan pasangannya",
    "Pasangan baru",
    "Urutan yang berbeda",
    "Cermati cirinya",
    "Aku bisa mencocokkan",
  ],
  counting: [
    "Mulai menghitung",
    "Kelompok benda baru",
    "Hitung dari susunan berbeda",
    "Pilih jumlah yang tepat",
    "Aku bisa berhitung",
  ],
  maze: [
    "Jalan pertama",
    "Rute baru",
    "Temukan belokannya",
    "Misi berikutnya",
    "Sampai tujuan!",
  ],
  math: [
    "Kenalan dengan operasi",
    "Soal dengan benda baru",
    "Berlatih dalam cerita",
    "Cek hitunganmu",
    "Aku bisa menyelesaikan",
  ],
  vocabulary: [
    "Kata pertamaku",
    "Kenalan dengan kata baru",
    "Pasangkan gambar dan kata",
    "Kata dalam konteks",
    "Aku ingat kata-katanya",
  ],
  reading: [
    "Cerita pertama",
    "Kenali tokohnya",
    "Urutan peristiwa",
    "Temukan jawabannya",
    "Ceritakan kembali",
  ],
  patterns: [
    "Kenali polanya",
    "Pola dengan benda baru",
    "Bagian yang hilang",
    "Urutan berikutnya",
    "Aku bisa menemukan pola",
  ],
  classification: [
    "Kenali kelompoknya",
    "Kelompok benda baru",
    "Cermati persamaan",
    "Pilih kategori yang tepat",
    "Aku bisa mengelompokkan",
  ],
  letters: [
    "Kenalan dengan huruf",
    "Huruf dan gambar",
    "Cari huruf yang sama",
    "Huruf dalam kata",
    "Aku mengenal huruf",
  ],
  numbers: [
    "Kenalan dengan angka",
    "Angka dan jumlah",
    "Temukan angka yang tepat",
    "Urutan angka",
    "Aku mengenal angka",
  ],
};
const themesEnglish: Record<string, string[]> = {
  animals: [
    "friendly land animals",
    "birds",
    "gentle forest animals",
    "small garden animals",
    "familiar pets",
  ],
  farm: [
    "chicks and hens",
    "rabbits and carrots",
    "cows and milk buckets",
    "sheep and lambs",
    "ducks and ponds",
  ],
  ocean: [
    "fish and shells",
    "octopuses and starfish",
    "whales and sea turtles",
    "crabs and coral",
    "seahorses and jellyfish",
  ],
  space: [
    "rockets and moons",
    "planets and stars",
    "astronaut tools",
    "satellites and meteors",
    "a friendly lunar base",
  ],
  dinosaurs: [
    "gentle long-neck dinosaurs",
    "baby dinosaurs and eggs",
    "friendly horned dinosaurs",
    "dinosaur footprints",
    "prehistoric plants and dinosaur friends",
  ],
  fruits: [
    "apples and pears",
    "bananas and strawberries",
    "oranges and grapes",
    "mangoes and watermelons",
    "a mixed fruit basket",
  ],
  alphabet: [
    "a first age-appropriate letter set",
    "a different letter set",
    "letters in familiar names of objects",
    "new letter-picture combinations",
    "a new review set",
  ],
  numbers: [
    "a first age-appropriate number set",
    "new quantities in the same range",
    "different arrangements of familiar quantities",
    "new combinations within the same range",
    "an unseen review set",
  ],
  shapes: [
    "circles and squares",
    "triangles and rectangles",
    "shapes in familiar objects",
    "new arrangements of familiar shapes",
    "an unseen mixed shape set",
  ],
};
export function getSeriesPlan(d: WorksheetForm): SeriesPage[] {
  const count = d.pageCount ?? 5;
  const labels = progressions[d.activityType] ?? [
    "Ayo berkenalan",
    "Coba contoh baru",
    "Berlatih lagi",
    "Terapkan yang dipelajari",
    "Aku makin bisa",
  ];
  const theme =
    d.theme === "custom" ? d.customTheme! : labelOf(themes, d.theme);
  const vocabulary = themesEnglish[d.theme] ?? [`new examples from ${theme}`];
  const age = getAgeRules(d.ageRange, d.customAge);
  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    title:
      labels[i % labels.length] +
      (i >= labels.length
        ? ` · variasi ${Math.floor(i / labels.length) + 1}`
        : ""),
    focus: `${i === 0 ? "Mulai dengan contoh yang mudah dikenali." : i === count - 1 ? "Ulangi keterampilan dengan soal yang belum pernah muncul." : "Latihan baru, tetap dalam tema dan tingkat usia yang sama."} ${getTaskCount(d)} aktivitas di lembar ini.`,
    instruction: `Page ${i + 1}/${count}: ${i === 0 ? "Introduce the skill with familiar examples and one small worked visual example outside the answer area." : i === count - 1 ? "Review the same skill using previously unseen questions; avoid adding a new skill." : "Reinforce the same skill using new examples; vary object selection, positions or question values, not the activity mechanics."} Content set: ${vocabulary[i % vocabulary.length]}. Create ${getTaskCount(d)} fresh tasks. All examples, vocabulary and quantities must fit ${age.readingLevel}; ${age.cognitiveLoad}. ${i > 0 ? "Do not repeat a question, completed solution, maze path or exact object arrangement from earlier pages." : ""} Set identifier ${i + 1} is internal and must not be printed.`,
  }));
}
export function getConsistencyRules(d: WorksheetForm) {
  return `Use page 1 as the visual reference for the entire ${d.pageCount}-page series. Maintain a SERIES DESIGN RECORD in this conversation: exact character silhouette, face, proportions, costume and distinguishing marks; 3–5 palette colors (or black/white line-art rules); line weight and shading; title and body font treatments; header identity placement; page grid, margins and answer-box sizes. Pick one restrained coherent design on page 1 and keep it unchanged on every continuation. New themed objects may be introduced without redesigning returning characters. Keep ${d.visualStyle === "custom" ? d.customStyle : d.visualStyle}, ${d.colorMode}, ${d.paperSize === "custom" ? d.customPaperSize : d.paperSize}, ${d.orientation}, language and supplied identity fixed unless explicitly updated for the whole series. A single-page revision must not overwrite the canonical SERIES DESIGN RECORD; only an explicit series-wide change updates it. Change ONLY the current page's learning content and page number. Do not introduce a cover page, poster, collage, contact sheet or multi-page image. User revisions apply to the CURRENT page only unless explicitly requested for the whole series. A revision must not silently advance the page counter. If previous images or the design record are unavailable, ask for the last approved page as a reference instead of claiming exact visual continuity.`;
}
export function getContinuationCommand(page: number) {
  if (!Number.isInteger(page) || page < 2 || page > 20)
    throw new Error("Nomor gambar lanjutan harus 2–20.");
  return `lanjut gambar ${page}`;
}
export function getContinuationRules(d: WorksheetForm) {
  return [
    `This is a sequential ${d.pageCount}-page worksheet project. ONE RESPONSE = ONE WORKSHEET IMAGE = ONE PRINTABLE PAGE. Start by generating ONLY image 1, then STOP and wait. Do not generate the whole set in the first response. Do not replace the requested image with a written lesson plan, prompt, code or description. If image generation is unavailable, state that clearly instead of pretending an image was produced.`,
    d.pageCount > 1
      ? `When the user writes "lanjut gambar 2", generate ONLY image 2 of THIS SAME series. Interpret "lanjut gambar N" as an explicit request for page N, using the page plan and design record below. The command always refers to this existing project, not a new theme or a new design. No need to ask again for settings or identity.`
      : 'This project contains only page 1. Any continuation request, including "lanjut gambar 2", is outside this plan: ask whether the user wants to extend the series before rendering a second page.',
    `For "lanjut" without a number, use the next page after the most recently generated page. For a repeated page number, revise/regenerate that page without incrementing the series. If a page is requested out of order, use its exact plan and retain the page 1 reference; do not generate intervening pages. If N is outside 1–${d.pageCount}, ask whether to extend the series before creating anything.`,
    `Number the footer unobtrusively in the worksheet language: ${d.language === "id" ? `Lembar N dari ${d.pageCount}` : `Page N of ${d.pageCount}`}. Never print the chat command or production notes on the worksheet. After an image, at most one short line OUTSIDE the image may suggest the next command. After page ${d.pageCount}, say that the series is complete; do not offer a nonexistent next page.`,
  ].join("\n");
}
