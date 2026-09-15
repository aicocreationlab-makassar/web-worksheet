import { describe, it, expect } from "vitest";
import { templates } from "@/data/templates";
import { activities } from "@/data/options";
import { getAgeRules, getTaskCount } from "@/lib/prompt-engine/ageRules";
import { getActivityRules } from "@/lib/prompt-engine/activityRules";
import {
  buildWorksheetPrompt,
  buildPromptSections,
} from "@/lib/prompt-engine/buildPrompt";
import { getFollowups } from "@/lib/prompt-engine/followupPrompts";
import {
  defaultForm,
  validateStep,
  WorksheetFormSchema,
  type WorksheetForm,
} from "@/lib/schemas/worksheet";
const form: WorksheetForm = { ...templates[2].form };
describe("age adaptation", () => {
  it("uses developmental profiles including custom ages", () => {
    expect(getAgeRules("3-4").maxTaskCount).toBe(4);
    expect(getAgeRules("5-6").elementSize).toBe("large");
    expect(getAgeRules("custom", "8")).toEqual(getAgeRules("7-8"));
    expect(getAgeRules("11-12").cognitiveLoad).toContain(
      "reduced childishness",
    );
  });
  it("caps task count for young children", () => {
    expect(getTaskCount({ ...form, ageRange: "3-4", activityCount: 12 })).toBe(
      4,
    );
    expect(getTaskCount(form)).toBe(5);
  });
  it("rejects unknown ages", () => {
    expect(() => getAgeRules("unsupported")).toThrow();
    expect(() => getAgeRules("custom", "2")).toThrow();
  });
});
describe("activity engine", () => {
  it.each(activities.map((a) => [a.value]))(
    "provides actionable mechanics for %s",
    (type) => {
      expect(getActivityRules(type, "Sort friendly robots")).toBeTruthy();
    },
  );
  it("enforces unique matching and correct counts", () => {
    expect(getActivityRules("matching")).toContain("exactly one correct match");
    expect(getActivityRules("counting")).toContain("verify every group");
  });
});
describe("composable prompt builder", () => {
  it("satisfies the ocean matching acceptance scenario", () => {
    const p = buildWorksheetPrompt(form);
    for (const text of [
      "expert children's worksheet designer",
      "5-6",
      "ocean",
      "matching",
      "large objects",
      "whitespace",
      "A4",
      "flat printable page",
      "watermarks",
      "mockups",
      "child-friendly",
    ])
      expect(p.toLowerCase()).toContain(text.toLowerCase());
    expect(buildPromptSections(form)).toHaveLength(19);
    expect(p).toMatch(/The next user command is "lanjut gambar 2"\.$/);
  });
  it("includes all custom input and print preferences", () => {
    const p = buildWorksheetPrompt({
      ...form,
      theme: "custom",
      customTheme: "Friendly garden robots",
      ageRange: "custom",
      customAge: "7",
      subject: "custom",
      customSubject: "Ecology",
      activityType: "custom",
      customActivity: "Sort recycled materials",
      visualStyle: "custom",
      customStyle: "Watercolor collage",
      paperSize: "custom",
      customPaperSize: "148 x 210 mm",
      orientation: "landscape",
      language: "en",
      characterStyle: "Round blue robot",
      decorativeLevel: "minimal",
      objectCount: 4,
      activityCount: 6,
      learningObjective: "Recognize reusable objects",
      customNotes: "Include a small leaf",
      difficulty: "medium",
    });
    for (const text of [
      "Friendly garden robots",
      "aged 7 years",
      "Ecology",
      "Sort recycled materials",
      "Watercolor collage",
      "148 x 210 mm",
      "landscape",
      "English",
      "Round blue robot",
      "minimal",
      "4 objects",
      "6 activity items",
      "Recognize reusable objects",
      "Include a small leaf",
      "medium",
    ])
      expect(p).toContain(text);
  });
  it("lets coloring rules override full-color rendering", () => {
    const p = buildWorksheetPrompt({
      ...form,
      activityType: "coloring",
      colorMode: "full-color",
    });
    expect(p).toContain("Override any color");
    expect(p).toContain("white interiors");
  });
  it("makes printer-friendly style actually ink-friendly", () => {
    expect(
      buildWorksheetPrompt({
        ...form,
        colorMode: "printer-friendly",
        visualStyle: "Clay",
      }),
    ).toContain("no gray fills, no gradients");
  });
  it("validates all templates", () => {
    for (const t of templates) {
      expect(WorksheetFormSchema.safeParse(t.form).success).toBe(true);
      expect(buildWorksheetPrompt(t.form).length).toBeGreaterThan(1800);
    }
  });
  it("rejects unsupported input before generation", () => {
    expect(() =>
      buildWorksheetPrompt({
        ...form,
        theme: "bogus",
      } as unknown as WorksheetForm),
    ).toThrow();
  });
});
describe("form validation", () => {
  it("validates custom choices even when future steps are empty", () => {
    expect(validateStep({ ...defaultForm, theme: "custom" }, 0)).toContain(
      "Isi pilihan",
    );
    expect(
      validateStep(
        { ...defaultForm, theme: "custom", customTheme: "Garden" },
        0,
      ),
    ).toBeNull();
    expect(
      validateStep({ ...defaultForm, ageRange: "custom", customAge: "99" }, 1),
    ).toContain("3 sampai 12");
  });
  it("requires choices one step at a time", () => {
    expect(validateStep(defaultForm, 0)).not.toBeNull();
    expect(validateStep({ ...defaultForm, theme: "ocean" }, 0)).toBeNull();
    expect(validateStep({ ...defaultForm, theme: "ocean" }, 1)).not.toBeNull();
    expect(validateStep(form, 4)).toBeNull();
  });
  it.each([
    ["theme", "customTheme"],
    ["ageRange", "customAge"],
    ["subject", "customSubject"],
    ["activityType", "customActivity"],
    ["visualStyle", "customStyle"],
    ["paperSize", "customPaperSize"],
  ])("requires text for custom %s", (key, custom) => {
    expect(
      WorksheetFormSchema.safeParse({
        ...form,
        [key]: "custom",
        [custom]: "  ",
      }).success,
    ).toBe(false);
  });
  it("limits custom ages and counts", () => {
    expect(
      WorksheetFormSchema.safeParse({
        ...form,
        ageRange: "custom",
        customAge: "99",
      }).success,
    ).toBe(false);
    expect(
      WorksheetFormSchema.safeParse({ ...form, activityCount: 0 }).success,
    ).toBe(false);
    expect(
      WorksheetFormSchema.safeParse({ ...form, objectCount: 21 }).success,
    ).toBe(false);
  });
});
describe("follow-up suggestions", () => {
  it("adapts followups to theme and language", () => {
    const id = getFollowups(form);
    expect(id).toHaveLength(6);
    expect(id[0].prompt).toContain("Bawah laut");
    expect(id[4].prompt).toContain("English");
    expect(getFollowups({ ...form, language: "en" })[4].prompt).toContain(
      "Bahasa Indonesia",
    );
  });
});
