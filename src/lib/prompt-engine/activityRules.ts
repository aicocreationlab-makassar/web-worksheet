const rules: Record<string, string> = {
  tracing:
    "Follow large dotted paths with a pencil. Show a clear starting dot and directional arrows; provide a practice row.",
  coloring:
    "Color the large enclosed shapes. Use bold black outlines and white interiors, with no pre-filled colors in the activity area.",
  matching:
    "Draw a line from each object in the left column to its unique matching partner in the right column. Shuffle the right column; leave a generous central gap. Each pair must have exactly one correct match.",
  counting:
    "Count each group of objects and circle the correct answer from three distinct number choices. Exactly one answer must match the visible object count; verify every group.",
  differences:
    "Compare two clearly separated scenes and circle a small, age-appropriate number of intentional differences. Keep every other detail identical.",
  maze: "Trace a continuous route from the marked start to the marked finish. Include exactly one solvable route, wide corridors and no blocked endpoints.",
  "cut-paste":
    "Cut along dotted outlines and paste each piece in its matching empty box. Use simple shapes and include an adult-supervision note for scissors.",
  spot: "Find and circle the requested objects in a spacious scene. Include a clear target legend and exact object counts.",
  letters:
    "Recognize the target letter, circle matching letters and trace the letter on a large dotted guide.",
  numbers:
    "Identify each numeral, match it to the correct quantity and trace its dotted form.",
  math: "Solve age-appropriate addition or subtraction with visual support. Provide one unambiguous problem and a large blank answer box per row.",
  vocabulary:
    "Match each illustrated object to the correct word. Use familiar, age-appropriate vocabulary and clear spelling.",
  reading:
    "Read a short, age-appropriate passage and answer explicit comprehension questions. For pre-readers, use an adult-read picture story with pointing or matching responses.",
  classification:
    "Sort pictured objects into clearly labeled categories with a single unambiguous category per object.",
  patterns:
    "Observe the repeating pattern and draw or select the missing next item. Each pattern must have one unambiguous solution.",
};
export function getActivityRules(type: string, custom?: string) {
  if (type === "custom")
    return `Use this custom activity: ${custom}. Define clear child-facing steps and one unambiguous expected response per item.`;
  if (!rules[type]) throw new Error("Aktivitas tidak dikenal.");
  return rules[type];
}
