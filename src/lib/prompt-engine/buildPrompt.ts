import {
  WorksheetFormSchema,
  type WorksheetForm,
} from "@/lib/schemas/worksheet";
import { activities, labelOf, themes } from "@/data/options";
import { getTaskCount } from "./ageRules";
import { getActivityRules } from "./activityRules";
import { getVisualRules } from "./visualRules";

export type PromptSection = { title: string; content: string };
export const getTheme = (d: WorksheetForm) =>
  d.theme === "custom" ? d.customTheme! : labelOf(themes, d.theme);
export const getActivity = (d: WorksheetForm) =>
  d.activityType === "custom"
    ? d.customActivity!
    : labelOf(activities, d.activityType);

function languageOf(d: WorksheetForm) {
  return d.language === "id" ? "Bahasa Indonesia" : "English";
}

function identityBrief(d: WorksheetForm) {
  const fields = [
    ["series title", d.worksheetTitle],
    ["child name", d.childName],
    ["class/group", d.className],
    ["school", d.schoolName],
    ["additional identity", d.additionalIdentity],
  ].filter(([, value]) => value?.trim());
  if (!fields.length)
    return "Do not invent a child name, class, school, or other personal detail.";
  return `Header display text (copy exactly, never translate): ${fields
    .map(([label, value]) => `${label} ${JSON.stringify(value)}`)
    .join("; ")}. Keep it compact and do not add missing personal details.`;
}

/** Keep the immediate image request short: long protocols can cause a text reply instead of a render. */
export function buildPromptSections(
  input: WorksheetForm,
  pageNumber = 1,
): PromptSection[] {
  const d = WorksheetFormSchema.parse(input);
  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    pageNumber > d.pageCount
  )
    throw new Error("Nomor gambar berada di luar seri worksheet.");

  const taskCount = getTaskCount(d);
  const objective =
    d.learningObjective.trim() ||
    `Practice ${getActivity(d)} with age-appropriate ${d.subject === "custom" ? d.customSubject : d.subject} concepts`;

  return [
    {
      title: "RENDER NOW",
      content:
        "Create and render ONE finished printable worksheet image now. Return the image, not an explanation, plan, confirmation, or description. Do not say that the image has already been made; make it in this response.",
    },
    {
      title: "WORKSHEET",
      content: `Image ${pageNumber} of ${d.pageCount} in a ${getTheme(d)} learning series for children aged ${d.ageRange === "custom" ? `${d.customAge} years` : `${d.ageRange} years`}. Subject: ${d.subject === "custom" ? d.customSubject : d.subject}. Objective: ${objective}. Difficulty: ${d.difficulty}. Worksheet language: ${languageOf(d)}. Activity: ${getActivity(d)}. Use new, theme-related examples on this page; do not repeat a previous page's exact questions or object arrangement.`,
    },
    {
      title: "PAGE CONTENT",
      content: `Make exactly ${taskCount} fresh, easy-to-read activity items. ${getActivityRules(d.activityType, d.customActivity)} Use ${d.objectCount ? `${d.objectCount} objects per task where relevant` : "small, clear object groups"}. Keep every answer unambiguous, every response area empty, and all text suitable for this age. ${d.customNotes.trim() ? `Also: ${JSON.stringify(d.customNotes.trim())}.` : ""}`,
    },
    {
      title: "LOOK AND PRINT",
      content: `${getVisualRules(d)} Use one straight-on, flat ${d.paperSize === "custom" ? d.customPaperSize : d.paperSize} ${d.orientation} page on white, with a 12 mm safe margin, large title, one short instruction, generous whitespace, and pencil-friendly answer spaces. Print-ready; no bleed or cropped edges.`,
    },
    { title: "IDENTITY", content: identityBrief(d) },
    {
      title: "QUALITY",
      content: `Use child-friendly, non-scary imagery. Check spelling, counts, numbers, margins and legibility before rendering. No answers, watermark, logo, signature, UI, mockup, desk, hands, tiny text, clutter, collage, or multiple pages. Footer: "${d.language === "id" ? "Lembar" : "Page"} ${pageNumber} ${d.language === "id" ? "dari" : "of"} ${d.pageCount}".`,
    },
    {
      title: "NEXT PAGES",
      content:
        pageNumber < d.pageCount
          ? `Keep this page's character style, palette, type, margins, and identity as the series reference. When the user later sends "gambar ${pageNumber + 1}" or "lanjut gambar ${pageNumber + 1}" in this same chat, render only that next worksheet page with fresh tasks and the same design.`
          : "This is the final requested page.",
    },
  ];
}

export function buildWorksheetPrompt(data: WorksheetForm) {
  return buildPromptSections(data)
    .map((section) => `${section.title}\n${section.content}`)
    .join("\n\n");
}

export function buildContinuationPrompt(
  data: WorksheetForm,
  pageNumber: number,
) {
  if (pageNumber < 2) throw new Error("Gunakan prompt awal untuk gambar 1.");
  return buildPromptSections(data, pageNumber)
    .map((section) => `${section.title}\n${section.content}`)
    .join("\n\n");
}
