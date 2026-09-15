# PRD — AI Worksheet Prompt Generator

**Product:** [PRODUCT_NAME]  
**Version:** MVP v1  
**Platform:** Responsive Web Application  
**Framework:** Next.js  
**Primary device:** Mobile  
**Primary language:** Bahasa Indonesia  
**Secondary language:** English-ready architecture

---

# 1. Product Objective

Membangun aplikasi web yang membantu user menghasilkan **high-quality structured prompts** untuk membuat worksheet anak melalui AI image generation.

Produk harus:

- mudah dipakai non-teknis,
- menghasilkan prompt detail,
- age-aware,
- printable-aware,
- memiliki UI kids 3D,
- mobile-first,
- cepat,
- tanpa login untuk MVP.

---

# 2. Product Scope

## In Scope

- responsive public web app
- landing page
- generator wizard
- dynamic prompt engine
- result page
- copy-to-clipboard
- prompt breakdown
- follow-up prompt suggestions
- examples/templates
- local history
- lightweight client analytics hooks

## Out of Scope MVP

- direct AI generation
- payment
- account/login
- cloud database
- image upload
- collaborative editing
- marketplace
- PDF worksheet generation

---

# 3. Success Criteria

MVP dianggap berhasil jika:

- user bisa mencapai output prompt dalam ≤ 5 langkah,
- prompt dapat disalin satu klik,
- prompt memasukkan seluruh pilihan user,
- result readable di mobile 360px,
- generator state tidak hilang saat pindah step,
- setiap required field tervalidasi,
- interface usable tanpa horizontal scroll,
- Lighthouse performance target ≥ 85,
- accessibility target ≥ 90 where realistic,
- output dapat diedit sebelum copy.

---

# 4. Primary Persona

## Persona A — Parent

Need:
- worksheet untuk anak di rumah,
- tidak bisa desain,
- ingin cepat.

## Persona B — Teacher

Need:
- worksheet sesuai materi dan usia,
- butuh banyak variasi,
- harus printable.

## Persona C — Digital Product Creator

Need:
- membuat banyak printable,
- ingin hasil konsisten,
- memerlukan prompt terstruktur.

---

# 5. Information Architecture

```text
/
├─ Hero
├─ Benefits
├─ How It Works
├─ Template Preview
├─ USP
├─ FAQ
└─ CTA

/create
├─ Step 1 Theme
├─ Step 2 Age
├─ Step 3 Activity
├─ Step 4 Style
└─ Step 5 Review

/result
├─ Prompt
├─ Copy actions
├─ Prompt breakdown
├─ Follow-up prompts
└─ Generate again

/templates
/examples
/how-it-works
```

---

# 6. Landing Page Requirements

## Hero

Content placeholder:

```text
Headline:
[HEADLINE]

Subheadline:
[SUBHEADLINE]

Primary CTA:
Buat Prompt Worksheet

Secondary CTA:
Lihat Contoh
```

Hero visual:

- floating 3D pencil
- alphabet blocks
- worksheet card
- crayons
- star / cloud decorative objects

Avoid:
- excessive animation
- huge video
- intrusive carousel

---

# 7. Generator Wizard

## Step 1 — Theme

### UI

Display theme as large cards.

Each card contains:

- icon / illustration
- theme name

Example:

```text
Animals
Space
Ocean
Dinosaurs
Fruits
Vehicles
Alphabet
Numbers
Custom
```

Custom selection opens input:

```text
Describe your theme...
```

### Validation

At least one theme required.

---

## Step 2 — Target Age

Options:

```text
3–4
5–6
7–8
9–10
11–12
Custom
```

Age range maps to internal profile.

Example:

```ts
type AgeProfile = {
  instructionComplexity: "very-low" | "low" | "medium" | "high";
  elementSize: "extra-large" | "large" | "medium";
  maxTaskCount: number;
  suggestedActivities: string[];
  readingLevel: string;
};
```

---

# 8. Age Rules

## Age 3–4

```text
- very short instruction
- max 3–4 activity items
- oversized visual elements
- minimal reading
- tracing/coloring/matching
- high visual contrast
```

## Age 5–6

```text
- short instructions
- max 4–6 activity items
- early numbers and letters
- large answer area
```

## Age 7–8

```text
- simple multi-step activity allowed
- 5–8 activity items
- basic reading/math
```

## Age 9–10

```text
- more detailed instructions
- puzzle/classification/comprehension
```

## Age 11–12

```text
- educational worksheet visual style
- reduced childishness
- more structured reasoning activities
```

---

# 9. Step 3 — Learning & Activity

Fields:

```text
Subject
Learning objective
Activity type
Difficulty
```

## Subject

```text
Math
English
Bahasa Indonesia
Science
General Knowledge
Fine Motor
Logic
Custom
```

## Difficulty

```text
Easy
Medium
Challenging
Auto
```

Auto uses age rules.

---

# 10. Step 4 — Visual Customization

Fields:

```text
Visual Style
Color Mode
Paper Size
Orientation
Character Style
Decorative Level
Language
```

## Visual Style

```text
Cute 3D
Flat Cartoon
Kawaii
Storybook
Clay
Minimal
Bold Outline
Coloring Book
Custom
```

## Color Mode

```text
Full Color
Pastel
Black & White
Printer Friendly
```

## Paper Size

```text
A4
US Letter
Square
Custom
```

## Orientation

```text
Portrait
Landscape
```

---

# 11. Step 5 — Review

Show compact cards:

```text
Theme
Age
Activity
Style
Print format
```

CTA:

```text
Generate My Prompt
```

Secondary:

```text
Edit
```

---

# 12. Data Model

```ts
export type WorksheetForm = {
  theme: string;
  customTheme?: string;

  ageRange: "3-4" | "5-6" | "7-8" | "9-10" | "11-12" | "custom";
  customAge?: string;

  subject?: string;
  learningObjective?: string;

  activityType: string;
  customActivity?: string;

  difficulty: "auto" | "easy" | "medium" | "challenging";

  visualStyle: string;
  customStyle?: string;

  colorMode: "full-color" | "pastel" | "black-white" | "printer-friendly";

  paperSize: "A4" | "US Letter" | "square" | "custom";
  customPaperSize?: string;

  orientation: "portrait" | "landscape";

  language: "id" | "en" | string;

  characterStyle?: string;
  decorativeLevel?: "minimal" | "balanced" | "playful";

  activityCount?: number;
  objectCount?: number;

  customNotes?: string;
};
```

---

# 13. Prompt Engine Architecture

DO NOT generate prompt as one giant hardcoded string in page component.

Use composable functions.

Suggested folder:

```text
/lib/prompt-engine/
  index.ts
  buildPrompt.ts
  ageRules.ts
  activityRules.ts
  visualRules.ts
  printRules.ts
  safetyRules.ts
  followupPrompts.ts
```

---

# 14. Prompt Builder

Pseudo-code:

```ts
export function buildWorksheetPrompt(data: WorksheetForm) {
  const age = getAgeRules(data.ageRange);
  const activity = getActivityRules(data.activityType);
  const visual = getVisualRules(data.visualStyle);
  const print = getPrintRules(data.paperSize, data.orientation);

  return [
    buildRoleSection(),
    buildGoalSection(data),
    buildAudienceSection(data, age),
    buildContentSection(data),
    buildActivitySection(data, activity),
    buildLayoutSection(data, age),
    buildVisualSection(data, visual),
    buildTypographySection(age),
    buildPrintSection(data, print),
    buildSafetySection(),
    buildNegativeSection(),
    buildFinalInstruction(data)
  ].join("\n\n");
}
```

---

# 15. Required Prompt Sections

Every generated output MUST contain:

## ROLE

```text
You are an expert children's worksheet designer,
educational illustrator, and learning experience designer.
```

## GOAL

Explain exactly what worksheet must accomplish.

## TARGET AUDIENCE

Include:

- age
- reading complexity
- cognitive load

## WORKSHEET CONTENT

Include:

- theme
- activity
- learning objective
- number of questions/items

## ACTIVITY MECHANICS

Explain how child interacts.

Example:

```text
Count each object and circle the correct answer.
```

## PAGE LAYOUT

Specify:

- header
- instructions
- rows/cards
- whitespace
- answer area
- margins

## VISUAL STYLE

Specify:

- illustration type
- shape language
- color mood
- complexity

## TYPOGRAPHY

Specify readability rules.

## PRINT REQUIREMENTS

Specify:

- page size
- orientation
- flat page
- printable
- high resolution

## SAFETY

Specify:

- child friendly
- no unsafe imagery
- no frightening visuals

## NEGATIVE CONSTRAINTS

Always include avoidance list.

## FINAL INSTRUCTION

A short imperative ending.

---

# 16. Negative Prompt Rules

Base:

```text
Avoid:
- watermarks
- logos
- signatures
- UI elements
- browser frames
- mockups
- hands holding the page
- desk backgrounds
- cropped worksheet edges
- illegible text
- tiny text
- cluttered composition
- excessive decoration
- distorted letters
- distorted numbers
- duplicate objects
- inconsistent counting
- scary imagery
- adult themes
- violent imagery
```

---

# 17. Smart Follow-up Prompt System

Result page generates follow-up commands based on selected configuration.

Base examples:

```text
Make this worksheet easier for a younger child while preserving the same theme.

Create a second worksheet page using the exact same visual style and characters, but with different questions.

Convert the worksheet into printer-friendly black and white line art.

Increase the answer spaces and simplify the visual decoration.

Translate all worksheet instructions into Bahasa Indonesia while preserving layout.

Keep the same character design, colors, typography, and page structure.
```

---

# 18. Result Page

Required components:

```text
ResultHeader
PromptCard
PromptEditor
CopyButton
DownloadTxtButton
PromptBreakdown
FollowUpPromptList
RegenerateButton
StartOverButton
```

## Prompt Card

Requirements:

- monospaced or highly readable text area
- editable
- copy button sticky on mobile
- success toast
- full prompt selectable
- no horizontal overflow

---

# 19. Copy UX

On copy:

```text
Prompt copied! Paste it into ChatGPT.
```

Display next action:

```text
Open ChatGPT
```

URL:

```text
https://chatgpt.com/
```

Open in new tab.

---

# 20. "How to Generate" Guide

Result page shows:

```text
1. Copy the generated prompt.
2. Open ChatGPT.
3. Start a new chat.
4. Paste the prompt.
5. Ask ChatGPT to generate the image.
6. Review the worksheet.
7. Use one of the follow-up prompts to refine it.
8. Download / print the final result.
```

This is a critical onboarding feature.

---

# 21. Prompt Score

Optional MVP enhancement.

Score categories:

```text
Age Fit
Activity Clarity
Print Readiness
Visual Direction
Layout Specificity
```

Use deterministic rules only.

No AI API needed.

Example:

```text
Prompt Quality: 92/100
```

Do not pretend score is scientific.

Label:

```text
Prompt completeness score
```

---

# 22. Local History

Use:

```text
localStorage
```

Store latest 10 prompt sessions.

Data:

```ts
type HistoryItem = {
  id: string;
  createdAt: string;
  title: string;
  form: WorksheetForm;
  prompt: string;
};
```

No sensitive information.

---

# 23. State Management

Recommended:

```text
Zustand
```

Store:

```text
currentStep
formData
generatedPrompt
```

Use persistence only if helpful.

Alternative acceptable:

```text
React Context + useReducer
```

---

# 24. URL State

Optional:

```text
/create?template=animals-counting
```

Do not put entire prompt into URL.

---

# 25. Component Architecture

```text
/components
  /layout
    Navbar.tsx
    Footer.tsx

  /landing
    Hero.tsx
    Benefits.tsx
    HowItWorks.tsx
    Examples.tsx
    CTA.tsx

  /generator
    GeneratorShell.tsx
    StepProgress.tsx
    ThemeStep.tsx
    AgeStep.tsx
    ActivityStep.tsx
    StyleStep.tsx
    ReviewStep.tsx

  /result
    PromptEditor.tsx
    PromptBreakdown.tsx
    FollowUpPrompts.tsx
    HowToGenerate.tsx

  /ui
    KidsButton.tsx
    ChoiceCard.tsx
    BubbleCard.tsx
    StickerBadge.tsx
```

---

# 26. App Directory

```text
app/
  layout.tsx
  page.tsx

  create/
    page.tsx

  result/
    page.tsx

  templates/
    page.tsx

  examples/
    page.tsx

  how-it-works/
    page.tsx
```

---

# 27. Design System

## Style

Keywords:

```text
playful
soft
friendly
3D
toy-like
rounded
bright
clean
safe
spacious
```

## Border Radius

```text
cards: 24px–32px
buttons: 18px–24px
chips: full rounded
```

## Shadows

Use soft layered shadows.

Avoid heavy SaaS shadows.

## UI Depth

Cards may use:

```text
soft gradient
inner highlight
bottom shadow
sticker edge
```

---

# 28. Colors

Use CSS variables.

Placeholder:

```css
:root {
  --background: [BACKGROUND];
  --foreground: [FOREGROUND];

  --primary: [PRIMARY];
  --primary-foreground: [PRIMARY_FOREGROUND];

  --secondary: [SECONDARY];
  --accent: [ACCENT];

  --surface-yellow: [YELLOW];
  --surface-blue: [BLUE];
  --surface-pink: [PINK];
  --surface-green: [GREEN];

  --border: [BORDER];
}
```

Preferred feel:

- sky blue
- warm yellow
- soft pink
- mint green
- purple accent

Do not oversaturate every area.

---

# 29. Typography

Recommended categories:

- rounded display font for headings
- neutral sans-serif for body

Heading:
- playful
- bold
- rounded

Body:
- highly readable

Do not use overly decorative font in forms.

---

# 30. 3D Assets

Use either:

- custom illustration assets,
- lightweight PNG/WebP,
- CSS shapes,
- generated decorative assets.

Do not require heavy WebGL for MVP.

Asset examples:

```text
pencil
crayon
star
cloud
alphabet cube
smiling book
paper sheet
rocket
dinosaur
apple
```

---

# 31. Animation

Use Framer Motion.

Allowed:

- card hover lift
- button press
- subtle floating object
- step transition
- completion confetti

Avoid:

- excessive parallax
- motion on every element
- blocking animation
- infinite high-energy movement

Respect:

```css
prefers-reduced-motion
```

---

# 32. Responsive Rules

## Mobile

- single column
- sticky bottom CTA
- large touch targets
- card selection grid 2 columns where possible

## Tablet

- 2–3 column option grids

## Desktop

Generator max width:

```text
900–1100px
```

Center focused experience.

Do not turn into dashboard layout.

---

# 33. Accessibility

Requirements:

- semantic buttons
- visible focus states
- minimum tap target ≈ 44px
- label all controls
- color is not the only selection indicator
- aria-live for copy success
- sufficient contrast
- keyboard navigation

---

# 34. SEO

Landing metadata:

```text
title:
[PRODUCT_NAME] — AI Worksheet Prompt Generator

description:
Create professional AI prompts for printable children's worksheets in seconds.
```

Pages should include:

- structured headings
- FAQ
- OpenGraph metadata
- favicon
- social image

---

# 35. Analytics Events

Prepare abstraction:

```ts
track("generator_started");
track("generator_step_completed", { step });
track("prompt_generated");
track("prompt_copied");
track("followup_copied");
track("open_chatgpt_clicked");
```

Implementation provider optional.

---

# 36. Error States

Must handle:

- clipboard API unavailable
- localStorage unavailable
- invalid form state
- empty custom theme
- browser refresh
- unsupported values

Provide friendly error copy.

---

# 37. Empty States

History empty:

```text
Belum ada prompt.
Buat worksheet prompt pertamamu.
```

Templates empty fallback:

```text
Template sedang disiapkan.
Mulai dari generator utama.
```

---

# 38. Loading State

Prompt generation is local and should feel instant.

Still show a short playful transition:

```text
Building your worksheet prompt...
```

Duration must not artificially block user for long.

---

# 39. Templates Data

Suggested:

```ts
type WorksheetTemplate = {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  theme: string;
  ageRange: string;
  subject?: string;
  activityType: string;
  visualStyle: string;
  difficulty: string;
};
```

Initial templates:

```text
Farm Counting
Alphabet Tracing
Ocean Matching
Dinosaur Coloring
Space Maze
Fruit Vocabulary
Shape Recognition
Simple Addition
```

---

# 40. Example Template

```ts
{
  id: "farm-counting-5-6",
  title: "Farm Counting",
  description: "Count cute farm animals and circle the correct answer.",
  theme: "Farm Animals",
  ageRange: "5-6",
  subject: "Math",
  activityType: "Count and Circle",
  visualStyle: "Cute 3D",
  difficulty: "easy"
}
```

---

# 41. Form Validation

Use Zod.

Example:

```ts
const WorksheetFormSchema = z.object({
  theme: z.string().min(1),
  ageRange: z.string().min(1),
  activityType: z.string().min(1),
  visualStyle: z.string().min(1),
  orientation: z.enum(["portrait", "landscape"])
});
```

Add refinement for custom options.

---

# 42. Testing

## Unit Tests

Test:

```text
ageRules
promptBuilder
activityRules
followup generator
form validation
```

## Component Tests

Test:

```text
selection card
wizard navigation
copy button
review values
```

## E2E

Critical path:

```text
visit landing
→ click CTA
→ select theme
→ select age
→ select activity
→ select style
→ generate
→ prompt visible
→ copy works
```

---

# 43. Acceptance Criteria — Generator

- [ ] User cannot continue without required choice.
- [ ] Back button preserves values.
- [ ] Review shows correct selected values.
- [ ] Generate button produces a non-empty prompt.
- [ ] Prompt includes theme.
- [ ] Prompt includes age.
- [ ] Prompt includes activity.
- [ ] Prompt includes print constraints.
- [ ] Prompt includes negative constraints.
- [ ] Prompt ends with a final generation instruction.

---

# 44. Acceptance Criteria — UI

- [ ] No horizontal scroll at 360px width.
- [ ] Primary CTA visible without ambiguity.
- [ ] Tap targets are mobile-friendly.
- [ ] Selected card clearly differs from unselected card.
- [ ] Progress indicator shows current step.
- [ ] Result prompt is editable.
- [ ] Copy action shows confirmation.
- [ ] UI feels playful but remains readable.

---

# 45. Acceptance Criteria — Prompt Quality

Given:

```text
Age: 5–6
Theme: Ocean
Activity: Matching
Style: Cute 3D
```

Prompt must include:

```text
- expert worksheet designer role
- 5–6 year old audience
- ocean theme
- matching activity mechanics
- readable instruction
- large objects
- adequate whitespace
- A4/selected format
- printable flat page
- no mockup
- no watermark
- no clutter
- child-safe visual direction
```

---

# 46. Security & Privacy

MVP should not require personal data.

Do not:

- ask child name by default,
- collect birthday,
- collect child photo,
- store sensitive child data.

Custom notes remain local in MVP.

---

# 47. Performance

Requirements:

- use next/image
- optimize 3D assets
- lazy load noncritical media
- avoid giant client bundle
- minimize animation libraries usage
- server-render landing where possible

Generator can be client component.

---

# 48. Suggested File Tree

```text
src/
  app/
    page.tsx
    create/page.tsx
    result/page.tsx
    templates/page.tsx
    examples/page.tsx
    how-it-works/page.tsx

  components/
    landing/
    generator/
    result/
    layout/
    ui/

  data/
    themes.ts
    activities.ts
    templates.ts
    styles.ts

  lib/
    prompt-engine/
      buildPrompt.ts
      ageRules.ts
      activityRules.ts
      visualRules.ts
      printRules.ts
      safetyRules.ts
      followupPrompts.ts

    schemas/
      worksheet.ts

    storage/
      history.ts

  store/
    generatorStore.ts

  types/
    worksheet.ts
```

---

# 49. AI Coding Agent Build Instructions

Use the following instructions as the implementation contract.

## Agent Role

```text
You are a senior product engineer and UI engineer.

Build a production-quality MVP of a mobile-first worksheet prompt generator using Next.js App Router and TypeScript.

The application helps parents, teachers, tutors, homeschoolers, and digital creators generate professional prompts for AI-generated children's worksheets.

The website does not need to generate images in MVP.

Its main product output is a professional structured image-generation prompt.
```

---

# 50. Agent Constraints

The agent MUST:

```text
- use Next.js App Router
- use TypeScript
- implement responsive mobile-first UI
- keep business logic separate from UI
- implement prompt builder as composable functions
- validate form input
- preserve wizard state
- include local prompt history
- implement copy prompt
- implement follow-up prompts
- implement templates
- provide good empty/error states
- use accessible semantic HTML
```

The agent MUST NOT:

```text
- put prompt generation logic directly inside JSX
- hardcode one prompt only
- require authentication
- require a database for MVP
- require an external AI API
- build an admin dashboard
- use desktop-first layout
- use heavy 3D/WebGL
```

---

# 51. Agent Implementation Order

```text
1. scaffold project structure
2. configure design tokens
3. create data models
4. create static option data
5. implement age rule engine
6. implement activity rule engine
7. implement visual rule engine
8. implement prompt builder
9. add unit tests for prompt engine
10. build generator store
11. build wizard shell
12. implement each step
13. implement review
14. implement result page
15. add copy and TXT download
16. add follow-up prompts
17. add local history
18. build landing page
19. build templates/examples
20. polish responsive UI
21. audit accessibility
22. audit performance
23. test critical flow
```

---

# 52. Definition of Done

Project is complete when:

```text
npm run build
```

passes and the core flow works end-to-end.

Core flow:

```text
Landing
→ Generator
→ Select options
→ Review
→ Generate prompt
→ Edit prompt
→ Copy
→ Open ChatGPT
```

---

# 53. AI Agent Final Verification Checklist

Agent must manually verify:

```text
[ ] works at 360px
[ ] works at 390px
[ ] works at 430px
[ ] works on desktop
[ ] no overflow
[ ] no broken route
[ ] no required field bypass
[ ] generated prompt uses user data
[ ] prompt is editable
[ ] copy works
[ ] local history works
[ ] refresh does not crash
[ ] accessible focus states exist
[ ] reduced motion respected
[ ] no external AI key needed
```

---

# 54. Recommended MVP Copy

## Hero

```text
Ide worksheet sederhana.
Prompt AI profesional.

Buat prompt detail untuk menghasilkan worksheet anak yang lucu, jelas, dan siap dicetak.
```

CTA:

```text
Buat Prompt Gratis
```

Secondary:

```text
Lihat Contoh
```

---

# 55. Positioning Copy

```text
Tidak perlu jago prompt engineering.

Pilih tema, usia, dan aktivitas.
Kami susun prompt worksheet lengkap untukmu.
```

---

# 56. Product USP Copy Options

### Option A

```text
Worksheet ideas in.
Professional AI prompts out.
```

### Option B

```text
Prompt engineer khusus worksheet anak.
```

### Option C

```text
Dari ide worksheet ke prompt siap generate dalam hitungan detik.
```

### Option D

```text
Bikin worksheet AI lebih bagus tanpa belajar prompt engineering.
```

---

# 57. Future API Layer

Keep architecture ready for:

```text
POST /api/generate-prompt
POST /api/generate-image
POST /api/save-project
```

MVP prompt generation should remain local.

---

# 58. Optional AI Enhancement Later

Future AI API could be used for:

```text
automatic learning objective suggestions
worksheet content generation
prompt critique
prompt optimization
multi-page curriculum packs
```

But deterministic prompt builder remains valuable as fallback.

---

# 59. Final Product Principle

The user should never feel that they are "engineering a prompt."

They should feel they are simply:

> **designing a worksheet using friendly choices.**

The system handles prompt engineering in the background.
