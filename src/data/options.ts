export const themes = [
  { value: "animals", label: "Hewan", emoji: "🦁", color: "peach" },
  { value: "space", label: "Luar angkasa", emoji: "🚀", color: "lavender" },
  { value: "ocean", label: "Bawah laut", emoji: "🐳", color: "blue" },
  { value: "dinosaurs", label: "Dinosaurus", emoji: "🦕", color: "mint" },
  { value: "fruits", label: "Buah-buahan", emoji: "🍓", color: "pink" },
  { value: "vehicles", label: "Kendaraan", emoji: "🚗", color: "yellow" },
  { value: "alphabet", label: "Huruf & abjad", emoji: "🔤", color: "lavender" },
  { value: "numbers", label: "Angka", emoji: "🔢", color: "blue" },
  { value: "shapes", label: "Bentuk", emoji: "🔷", color: "peach" },
  { value: "nature", label: "Alam", emoji: "🌻", color: "mint" },
  { value: "farm", label: "Peternakan", emoji: "🐮", color: "yellow" },
  { value: "custom", label: "Tema sendiri", emoji: "✨", color: "pink" },
] as const;
export const activities = [
  { value: "tracing", label: "Menebalkan garis", emoji: "✏️" },
  { value: "coloring", label: "Mewarnai", emoji: "🎨" },
  { value: "matching", label: "Mencocokkan", emoji: "🧩" },
  { value: "counting", label: "Hitung & lingkari", emoji: "🔢" },
  { value: "differences", label: "Cari perbedaan", emoji: "🔍" },
  { value: "maze", label: "Labirin", emoji: "🌀" },
  { value: "cut-paste", label: "Gunting & tempel", emoji: "✂️" },
  { value: "spot", label: "Temukan objek", emoji: "👀" },
  { value: "letters", label: "Mengenal huruf", emoji: "🔤" },
  { value: "numbers", label: "Mengenal angka", emoji: "💯" },
  { value: "math", label: "Matematika sederhana", emoji: "➕" },
  { value: "vocabulary", label: "Kosakata", emoji: "📚" },
  { value: "reading", label: "Pemahaman bacaan", emoji: "📖" },
  { value: "classification", label: "Mengelompokkan", emoji: "🗂️" },
  { value: "patterns", label: "Melengkapi pola", emoji: "🔶" },
  { value: "custom", label: "Aktivitas sendiri", emoji: "✨" },
] as const;
export const styles = [
  "Cute 3D",
  "Flat Cartoon",
  "Kawaii",
  "Storybook",
  "Clay",
  "Minimal",
  "Bold Outline",
  "Coloring Book",
  "custom",
] as const;
export const subjects = [
  "Matematika",
  "Bahasa Inggris",
  "Bahasa Indonesia",
  "Sains",
  "Pengetahuan umum",
  "Motorik halus",
  "Logika",
  "custom",
] as const;
export const ages = ["3-4", "5-6", "7-8", "9-10", "11-12", "custom"] as const;
export const labelOf = (
  items: readonly { value: string; label: string }[],
  value: string,
) => items.find((x) => x.value === value)?.label ?? value;
