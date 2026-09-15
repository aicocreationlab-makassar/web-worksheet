import type { WorksheetForm } from "@/lib/schemas/worksheet";
export type AgeProfile = {
  readingLevel: string;
  instructionComplexity: string;
  elementSize: string;
  maxTaskCount: number;
  defaultTaskCount: number;
  suggestedActivities: string[];
  cognitiveLoad: string;
};
const profiles: Record<string, AgeProfile> = {
  "3-4": {
    readingLevel: "pre-reader; minimal reading",
    instructionComplexity: "very short, one action per instruction",
    elementSize: "extra-large",
    maxTaskCount: 4,
    defaultTaskCount: 3,
    suggestedActivities: ["tracing", "coloring", "matching"],
    cognitiveLoad:
      "very low; adult-guided activities with oversized visual cues",
  },
  "5-6": {
    readingLevel: "early reader; early numbers and letters",
    instructionComplexity: "short, single-sentence instructions",
    elementSize: "large",
    maxTaskCount: 6,
    defaultTaskCount: 5,
    suggestedActivities: ["counting", "letters", "matching"],
    cognitiveLoad: "low; one concept at a time and large answer areas",
  },
  "7-8": {
    readingLevel: "basic independent reading and math",
    instructionComplexity: "simple multi-step instructions",
    elementSize: "large",
    maxTaskCount: 8,
    defaultTaskCount: 6,
    suggestedActivities: ["math", "maze", "vocabulary"],
    cognitiveLoad: "moderate; simple multi-step tasks",
  },
  "9-10": {
    readingLevel: "independent reader",
    instructionComplexity: "clear detailed instructions",
    elementSize: "medium",
    maxTaskCount: 10,
    defaultTaskCount: 8,
    suggestedActivities: ["classification", "reading", "patterns"],
    cognitiveLoad: "moderate; classification, puzzles and comprehension",
  },
  "11-12": {
    readingLevel: "confident reader",
    instructionComplexity: "structured reasoning instructions",
    elementSize: "medium",
    maxTaskCount: 12,
    defaultTaskCount: 10,
    suggestedActivities: ["reading", "classification", "patterns"],
    cognitiveLoad: "higher; age-appropriate reasoning, reduced childishness",
  },
};
export function getAgeRules(range: string, customAge?: string): AgeProfile {
  if (range === "custom") {
    const age = Number(customAge);
    if (!Number.isInteger(age) || age < 3 || age > 12)
      throw new Error("Usia harus 3–12 tahun.");
    range =
      age <= 4
        ? "3-4"
        : age <= 6
          ? "5-6"
          : age <= 8
            ? "7-8"
            : age <= 10
              ? "9-10"
              : "11-12";
  }
  if (!profiles[range]) throw new Error("Rentang usia tidak dikenal.");
  return profiles[range];
}
export function getTaskCount(data: WorksheetForm) {
  const age = getAgeRules(data.ageRange, data.customAge);
  return Math.min(data.activityCount ?? age.defaultTaskCount, age.maxTaskCount);
}
