import type { WorksheetForm } from "@/lib/schemas/worksheet";
const rules: Record<string, string> = {
  "Cute 3D":
    "Soft 3D-inspired illustrations, rounded toy-like shapes and subtle shading inside objects only.",
  "Flat Cartoon":
    "Simple flat cartoon shapes, clean silhouettes and consistent outlines.",
  Kawaii: "Cute minimal faces, soft rounded shapes and restrained details.",
  Storybook:
    "Warm hand-painted storybook illustrations with readable silhouettes.",
  Clay: "Soft clay-like characters, tactile rounded shapes and subtle material texture.",
  Minimal: "Minimal geometric illustrations with ample negative space.",
  "Bold Outline": "Thick consistent outlines and clear, large shapes.",
  "Coloring Book":
    "Unfilled enclosed shapes, bold black outlines and white interiors.",
};
export function getVisualRules(data: WorksheetForm) {
  const monochrome =
    data.colorMode === "black-white" ||
    data.colorMode === "printer-friendly" ||
    data.activityType === "coloring" ||
    data.visualStyle === "Coloring Book";
  return `${data.visualStyle === "custom" ? data.customStyle : rules[data.visualStyle]} ${monochrome ? "Override any color or shaded style with printer-friendly black and white line art, pure white background, no gray fills, no gradients and no heavy ink coverage." : data.colorMode === "pastel" ? "Use soft pastel colors with sufficient text contrast." : "Use cheerful, balanced full colors on a light background."} Character direction: ${data.characterStyle || "friendly rounded characters"}. Decoration level: ${data.decorativeLevel}; never interfere with tasks.`;
}
