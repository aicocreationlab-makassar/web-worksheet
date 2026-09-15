import { z } from "zod";
import { activities, ages, styles, subjects, themes } from "@/data/options";
export const baseSchema = z.object({
  theme: z.enum(themes.map((x) => x.value)),
  customTheme: z.string().max(180).optional(),
  ageRange: z.enum(ages),
  customAge: z.string().optional(),
  subject: z.enum(subjects),
  customSubject: z.string().max(120).optional(),
  learningObjective: z.string().max(500),
  activityType: z.enum(activities.map((x) => x.value)),
  customActivity: z.string().max(300).optional(),
  difficulty: z.enum(["auto", "easy", "medium", "challenging"]),
  visualStyle: z.enum(styles),
  customStyle: z.string().max(200).optional(),
  colorMode: z.enum([
    "full-color",
    "pastel",
    "black-white",
    "printer-friendly",
  ]),
  paperSize: z.enum(["A4", "US Letter", "square", "custom"]),
  customPaperSize: z.string().max(100).optional(),
  orientation: z.enum(["portrait", "landscape"]),
  language: z.enum(["id", "en"]),
  characterStyle: z.string().max(200),
  decorativeLevel: z.enum(["minimal", "balanced", "playful"]),
  activityCount: z.number().int().min(1).max(12).optional(),
  objectCount: z.number().int().min(1).max(20).optional(),
  pageCount: z.number().int().min(1).max(20).default(5),
  childName: z.string().trim().max(80).default(""),
  className: z.string().trim().max(80).default(""),
  schoolName: z.string().trim().max(120).default(""),
  worksheetTitle: z.string().trim().max(120).default(""),
  additionalIdentity: z.string().trim().max(160).default(""),
  customNotes: z.string().max(1500),
});
export const WorksheetFormSchema = baseSchema.superRefine((data, ctx) => {
  const pairs = [
    ["theme", "customTheme"],
    ["ageRange", "customAge"],
    ["subject", "customSubject"],
    ["activityType", "customActivity"],
    ["visualStyle", "customStyle"],
    ["paperSize", "customPaperSize"],
  ] as const;
  for (const [key, custom] of pairs)
    if (data[key] === "custom" && !data[custom]?.trim())
      ctx.addIssue({
        code: "custom",
        path: [custom],
        message: "Isi pilihan khusus ini dulu, ya.",
      });
  if (
    data.ageRange === "custom" &&
    !/^(?:[3-9]|1[0-2])$/.test(data.customAge ?? "")
  )
    ctx.addIssue({
      code: "custom",
      path: ["customAge"],
      message: "Masukkan usia 3 sampai 12 tahun.",
    });
});
export type WorksheetForm = z.infer<typeof baseSchema>;
export type DraftForm = Omit<
  WorksheetForm,
  "theme" | "ageRange" | "activityType"
> & {
  theme: WorksheetForm["theme"] | "";
  ageRange: WorksheetForm["ageRange"] | "";
  activityType: WorksheetForm["activityType"] | "";
};
export const defaultForm: DraftForm = {
  theme: "",
  ageRange: "",
  subject: "Pengetahuan umum",
  learningObjective: "",
  activityType: "",
  difficulty: "auto",
  visualStyle: "Cute 3D",
  colorMode: "pastel",
  paperSize: "A4",
  orientation: "portrait",
  language: "id",
  characterStyle: "Karakter ramah dengan bentuk membulat",
  decorativeLevel: "balanced",
  customNotes: "",
  pageCount: 5,
  childName: "",
  className: "",
  schoolName: "",
  worksheetTitle: "",
  additionalIdentity: "",
};
export const stepFields = [
  ["theme", "customTheme"],
  ["ageRange", "customAge"],
  [
    "subject",
    "customSubject",
    "learningObjective",
    "activityType",
    "customActivity",
    "difficulty",
    "activityCount",
    "objectCount",
    "pageCount",
  ],
  [
    "visualStyle",
    "customStyle",
    "colorMode",
    "paperSize",
    "customPaperSize",
    "orientation",
    "language",
    "characterStyle",
    "decorativeLevel",
    "customNotes",
    "childName",
    "className",
    "schoolName",
    "worksheetTitle",
    "additionalIdentity",
  ],
] as const;
export function validateStep(form: DraftForm, step: number): string | null {
  if (step < 4) {
    const fields = stepFields[step];
    for (const key of fields) {
      if (!baseSchema.shape[key].safeParse(form[key]).success) {
        if(key==='pageCount')return 'Pilih jumlah lembar antara 1–20.';
        if(key==='activityCount')return 'Isi 1–12 aktivitas per lembar. Jumlahnya akan disesuaikan usia.';
        if(key==='objectCount')return 'Isi jumlah objek antara 1–20.';
        return "Lengkapi pilihan yang diperlukan sebelum melanjutkan.";
      }
    }
    const customPairs = [
      ["theme", "customTheme"],
      ["ageRange", "customAge"],
      ["subject", "customSubject"],
      ["activityType", "customActivity"],
      ["visualStyle", "customStyle"],
      ["paperSize", "customPaperSize"],
    ] as const;
    for (const [key, custom] of customPairs) {
      if (
        (fields as readonly string[]).includes(key) &&
        form[key] === "custom" &&
        !form[custom]?.trim()
      )
        return "Isi pilihan khusus ini dulu, ya.";
    }
    if (
      step === 1 &&
      form.ageRange === "custom" &&
      !/^(?:[3-9]|1[0-2])$/.test(form.customAge ?? "")
    )
      return "Masukkan usia 3 sampai 12 tahun.";
    return null;
  }
  const result = WorksheetFormSchema.safeParse(form);
  if (result.success) return null;
  const issue = result.error.issues.find(
    (x) =>
      step === 4 ||
      (stepFields[step] as readonly string[]).includes(String(x.path[0])),
  );
  return issue
    ? issue.code === "custom"
      ? issue.message
      : "Lengkapi pilihan yang diperlukan sebelum melanjutkan."
    : null;
}
