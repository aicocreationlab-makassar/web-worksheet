import { defaultForm, type WorksheetForm } from "@/lib/schemas/worksheet";
export type WorksheetTemplate = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  category: string;
  form: WorksheetForm;
};
const template = (
  id: string,
  title: string,
  description: string,
  emoji: string,
  color: string,
  category: string,
  form: Partial<WorksheetForm>,
): WorksheetTemplate => ({
  id,
  title,
  description,
  emoji,
  color,
  category,
  form: {
    ...defaultForm,
    theme: "animals",
    ageRange: "5-6",
    activityType: "counting",
    ...form,
  } as WorksheetForm,
});
export const templates: WorksheetTemplate[] = [
  template(
    "farm-counting",
    "Serunya menghitung hewan",
    "Kenalan dengan angka bersama teman-teman di peternakan.",
    "🐮",
    "mint",
    "Berhitung",
    {
      theme: "farm",
      subject: "Matematika",
      learningObjective: "Menghitung jumlah hewan dari 1 sampai 10",
      difficulty: "easy",
    },
  ),
  template(
    "alphabet-tracing",
    "Petualangan huruf ABC",
    "Latih tangan kecil menulis huruf-huruf pertamanya.",
    "🔤",
    "lavender",
    "Menulis",
    {
      theme: "alphabet",
      activityType: "tracing",
      subject: "Bahasa Indonesia",
      ageRange: "3-4",
      visualStyle: "Bold Outline",
    },
  ),
  template(
    "ocean-matching",
    "Teman-teman bawah laut",
    "Cocokkan hewan laut dan temukan pasangan yang tepat.",
    "🐳",
    "blue",
    "Mencocokkan",
    { theme: "ocean", activityType: "matching" },
  ),
  template(
    "dinosaur-coloring",
    "Warnai dunia dinosaurus",
    "Beri warna pada dinosaurus yang lucu dan ramah.",
    "🦕",
    "peach",
    "Mewarnai",
    {
      theme: "dinosaurs",
      activityType: "coloring",
      ageRange: "3-4",
      colorMode: "black-white",
      visualStyle: "Coloring Book",
      subject: "Motorik halus",
    },
  ),
  template(
    "space-maze",
    "Misi menuju bulan",
    "Bantu roket menemukan jalan sampai ke bulan.",
    "🚀",
    "lavender",
    "Logika",
    {
      theme: "space",
      activityType: "maze",
      ageRange: "7-8",
      subject: "Logika",
    },
  ),
  template(
    "fruit-vocabulary",
    "Buah dan kata baru",
    "Pelajari nama buah dalam bahasa Inggris.",
    "🍓",
    "pink",
    "Bahasa",
    {
      theme: "fruits",
      activityType: "vocabulary",
      subject: "Bahasa Inggris",
      language: "en",
    },
  ),
  template(
    "shape-recognition",
    "Bermain dengan bentuk",
    "Kenali dan kelompokkan bentuk-bentuk di sekitarmu.",
    "🔷",
    "yellow",
    "Logika",
    { theme: "shapes", activityType: "classification", subject: "Logika" },
  ),
  template(
    "simple-addition",
    "Ayo tambah angkanya!",
    "Penjumlahan sederhana jadi petualangan menyenangkan.",
    "🔢",
    "mint",
    "Berhitung",
    {
      theme: "numbers",
      activityType: "math",
      subject: "Matematika",
      ageRange: "7-8",
    },
  ),
];
