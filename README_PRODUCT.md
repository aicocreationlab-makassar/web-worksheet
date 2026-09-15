# Worksheet Prompt Generator — Product Brief

> Working title: **[PRODUCT_NAME]**  
> Tagline placeholder: **Create better kids worksheets with better prompts.**

## 1. Product Summary

**[PRODUCT_NAME]** adalah web app mobile-first untuk membantu guru, orang tua, tutor, homeschooler, dan kreator edukasi membuat **prompt profesional untuk menghasilkan worksheet anak berbasis gambar**.

User tidak perlu memahami prompt engineering.

Mereka cukup memilih:

- tema worksheet,
- usia / rentang usia,
- tujuan belajar,
- gaya visual,
- tingkat kesulitan,
- tipe aktivitas,
- bahasa,
- ukuran / orientasi,
- jumlah halaman,
- dan beberapa opsi tambahan.

Aplikasi kemudian menghasilkan sebuah **structured image-generation prompt** yang sudah dirancang agar bisa langsung disalin ke ChatGPT / image generator lain.

Output utama aplikasi **bukan gambar**, melainkan prompt berkualitas tinggi yang menjelaskan:

1. konteks worksheet,
2. target anak,
3. tujuan belajar,
4. struktur halaman,
5. elemen visual,
6. typography dan readability,
7. komposisi,
8. batasan,
9. negative prompt / hal yang harus dihindari,
10. instruksi final untuk menghasilkan worksheet.

---

# 2. Problem

Membuat worksheet anak dengan AI terlihat mudah, tetapi hasil sering buruk karena prompt terlalu pendek atau ambigu.

Masalah yang umum:

- layout worksheet berantakan,
- teks terlalu kecil,
- instruksi tidak jelas,
- visual terlalu rumit untuk anak,
- karakter tidak konsisten,
- aktivitas tidak sesuai umur,
- terlalu banyak dekorasi,
- area jawaban sempit,
- gambar tidak printable,
- AI menghasilkan poster, bukan worksheet,
- worksheet sulit dicetak hitam-putih,
- hasil tidak memiliki learning objective yang jelas.

User non-teknis sering tidak tahu bahwa masalah utamanya adalah **prompt quality**.

---

# 3. Solution

**[PRODUCT_NAME]** mengubah pilihan sederhana menjadi prompt worksheet yang sistematis dan profesional.

Flow:

**Choose → Customize → Generate Prompt → Copy → Generate in ChatGPT**

Aplikasi bertindak sebagai:

> **Prompt engineer khusus worksheet anak.**

---

# 4. Unique Selling Proposition

## Primary USP

### **"From idea to production-ready worksheet prompt in under a minute."**

User tidak harus belajar prompt engineering.

Aplikasi mengubah kebutuhan sederhana seperti:

> "Worksheet mengenal hewan untuk anak umur 5 tahun"

menjadi prompt detail yang memperhitungkan:

- child-friendly cognitive load,
- worksheet layout,
- visual hierarchy,
- printability,
- reading level,
- safe visual composition,
- activity mechanics,
- educational objective,
- age appropriateness.

---

# 5. Key Differentiators

## 5.1 Prompt khusus worksheet, bukan prompt generator umum

Prompt generator umum hanya mengoptimalkan visual.

Produk ini mengoptimalkan:

- **visual**
- **education**
- **printability**
- **activity mechanics**
- **age suitability**

---

## 5.2 Age-aware Prompt Engine

Pilihan umur memengaruhi:

- panjang instruksi,
- ukuran elemen,
- kompleksitas aktivitas,
- jumlah objek,
- jenis vocabulary,
- tingkat detail visual.

Contoh:

**Age 3–4**
- instruksi sangat singkat,
- objek besar,
- 3–5 pilihan,
- aktivitas mencocokkan, mewarnai, tracing sederhana.

**Age 7–9**
- bisa ada multi-step instruction,
- puzzle,
- reading comprehension,
- classification,
- math problem,
- word challenge.

---

## 5.3 Worksheet Quality Guardrails

Prompt secara otomatis menambahkan rule seperti:

- no clutter,
- large readable text,
- clear answer areas,
- high contrast,
- simple child-friendly composition,
- printable A4 / Letter,
- safe and non-scary imagery,
- no watermark,
- no UI elements,
- no mockup presentation,
- no cropped instructions.

---

## 5.4 One-click "Prompt Recipe"

Selain prompt final, user dapat melihat struktur prompt:

- Role
- Objective
- Audience
- Worksheet type
- Visual direction
- Layout
- Content
- Constraints
- Negative prompt
- Final instruction

Ini membuat produk sekaligus **alat edukasi prompt engineering**.

---

## 5.5 ChatGPT-ready Output

Output sudah diformat agar bisa langsung:

1. disalin,
2. ditempel di ChatGPT,
3. dipakai untuk generate image,
4. direvisi dengan prompt lanjutan.

---

## 5.6 Smart Follow-up Prompts

Setelah prompt utama, aplikasi menyediakan:

- "Make it easier"
- "Make it harder"
- "Make it black and white"
- "Turn into coloring worksheet"
- "Create page 2"
- "Keep same characters"
- "Translate to Indonesian"
- "Fix spacing and answer boxes"

Ini menjadi pembeda penting karena user tidak berhenti di satu generation.

---

# 6. Target Users

## Primary

- Orang tua
- Guru TK / SD
- Tutor
- Homeschooler
- Kreator printable
- Seller worksheet digital
- Content creator edukasi

## Secondary

- Preschool
- Daycare
- Learning center
- UMKM edukasi
- Marketplace seller
- Canva creator
- Teacherpreneur

---

# 7. User Jobs To Be Done

### Functional

> Saat saya ingin membuat worksheet untuk anak, saya ingin memasukkan kebutuhan sederhana lalu mendapatkan prompt siap pakai agar saya tidak perlu memikirkan struktur prompt AI.

### Emotional

> Saya ingin merasa yakin bahwa hasil AI akan terlihat profesional dan sesuai untuk anak.

### Business

> Saya ingin membuat printable lebih cepat supaya bisa menghasilkan banyak variasi worksheet untuk kelas, konten, atau produk digital.

---

# 8. Core User Flow

```text
Landing
  ↓
Start Creating
  ↓
Choose Worksheet Theme
  ↓
Choose Age
  ↓
Choose Learning Goal
  ↓
Choose Activity Type
  ↓
Customize Style
  ↓
Generate Prompt
  ↓
Preview Prompt Structure
  ↓
Copy Prompt
  ↓
Open ChatGPT
  ↓
Generate Worksheet
  ↓
Use Follow-up Prompt
```

---

# 9. Input Fields

## Required

- Worksheet Theme
- Target Age
- Activity Type

## Optional

- Learning Objective
- Subject
- Difficulty
- Language
- Visual Style
- Character Style
- Color Mode
- Paper Size
- Orientation
- Number of Activities
- Number of Objects
- Text Density
- Answer Area
- Custom Notes

---

# 10. Example Themes

Use editable data, not hardcoded UI logic.

```ts
[
  "Animals",
  "Dinosaurs",
  "Space",
  "Ocean",
  "Fruits",
  "Vehicles",
  "Farm",
  "Princess",
  "Robots",
  "Nature",
  "Alphabet",
  "Numbers",
  "Shapes",
  "Colors",
  "Ramadan",
  "Custom"
]
```

---

# 11. Example Activity Types

```ts
[
  "Tracing",
  "Coloring",
  "Matching",
  "Count and Circle",
  "Find the Difference",
  "Maze",
  "Cut and Paste",
  "Spot the Object",
  "Letter Recognition",
  "Number Recognition",
  "Simple Math",
  "Vocabulary",
  "Reading Comprehension",
  "Classification",
  "Pattern Completion",
  "Custom"
]
```

---

# 12. Prompt Output Structure

Prompt yang dihasilkan harus memiliki section yang konsisten.

```text
ROLE
GOAL
TARGET AUDIENCE
WORKSHEET CONTENT
ACTIVITY MECHANICS
PAGE LAYOUT
VISUAL STYLE
TYPOGRAPHY
PRINT REQUIREMENTS
AGE APPROPRIATENESS
SAFETY / CONTENT RULES
NEGATIVE CONSTRAINTS
FINAL GENERATION INSTRUCTION
```

---

# 13. Prompt Example

```text
You are an expert children's worksheet designer and educational illustrator.

Create a printable A4 worksheet for children aged 5–6.

Theme:
Cute farm animals.

Learning objective:
Practice counting numbers 1–10.

Activity:
Count each group of animals and circle the correct number.

Layout:
- Large friendly title at the top.
- Short one-sentence instruction.
- 5 activity rows.
- Each row contains a group of 2–10 large farm animals.
- Place three number choices on the right.
- Provide generous spacing for circling answers.
- Keep strong visual hierarchy.
- Do not crowd the page.

Visual style:
- Soft 3D-inspired children's illustration.
- Rounded shapes.
- Friendly expressions.
- Bright but balanced colors.
- White or very light background.
- Clear outlines.

Typography:
- Large rounded child-friendly font.
- High readability.
- No decorative text for instructions.
- Avoid tiny labels.

Print requirements:
- A4 portrait.
- High resolution.
- Clean margins.
- No mockup.
- No desk background.
- No hands holding the worksheet.
- Show the worksheet itself as a flat page.

Age appropriateness:
- Simple activity.
- Maximum 5 task rows.
- No complex wording.
- No distracting decorative elements.

Avoid:
- watermarks,
- logos,
- UI elements,
- excessive shadows,
- tiny text,
- clutter,
- scary animals,
- realistic gore,
- cropped content,
- distorted numbers,
- incorrect counting.

Final instruction:
Generate the complete worksheet as one clean printable page.
```

---

# 14. UX Concept

The interface should feel like:

> **A playful creative toy for adults creating content for children.**

Not like a SaaS dashboard.

Design references:

- toy blocks,
- rounded cards,
- sticker-like icons,
- soft 3D objects,
- playful depth,
- large tap targets,
- bright backgrounds,
- gentle micro-interactions.

---

# 15. UI Direction

## Visual Language

- 3D kids aesthetic
- soft rounded corners
- bubble buttons
- colorful cards
- playful icons
- subtle shadows
- floating decorative shapes
- minimal text per screen

## Important

Walaupun UI bertema anak, **primary user adalah orang dewasa**.

Jangan membuat UX menjadi terlalu childish sampai membingungkan.

---

# 16. Mobile-first Principles

Prioritaskan viewport:

- 360px
- 390px
- 430px

Kemudian:

- tablet
- desktop

Form dibuat step-by-step, bukan satu form panjang.

Recommended pattern:

```text
Step 1 of 5
[ Theme ]

Step 2 of 5
[ Age ]

Step 3 of 5
[ Activity ]

Step 4 of 5
[ Style ]

Step 5 of 5
[ Review ]
```

---

# 17. Suggested Pages

```text
/
 /create
 /result
 /examples
 /templates
 /how-it-works
 /about
```

Future:

```text
/dashboard
/history
/favorites
/pricing
```

---

# 18. MVP Features

1. Landing page
2. Worksheet generator wizard
3. Prompt generator engine
4. Prompt result page
5. Copy prompt
6. Download prompt as TXT
7. Prompt breakdown
8. Follow-up prompts
9. Example templates
10. Local history using localStorage
11. Mobile-first responsive UI
12. Dark mode optional, not required for MVP

---

# 19. Future Features

- AI auto-suggest
- direct image generation
- user accounts
- prompt history cloud sync
- template marketplace
- teacher profiles
- community templates
- favorite prompts
- prompt scoring
- worksheet batch generator
- bilingual worksheet
- PDF exporter
- Canva integration
- classroom packs
- commercial usage tier

---

# 20. Monetization Ideas

## Freemium

Free:
- limited generations per day
- basic themes
- basic prompt output

Pro:
- unlimited prompts
- advanced worksheet modes
- commercial-use prompt templates
- batch prompt generation
- advanced consistency prompts
- saved history
- custom brand / style presets

---

# 21. Suggested Tech Stack

```text
Framework: Next.js
Router: App Router
Language: TypeScript
Styling: Tailwind CSS
Components: shadcn/ui where useful
Icons: Lucide
State: Zustand or React Context
Validation: Zod
Forms: React Hook Form
Animation: Framer Motion
Storage MVP: localStorage
Database future: Supabase/PostgreSQL
Auth future: Supabase Auth / Clerk
Analytics: PostHog / Plausible
Deploy: Vercel
```

---

# 22. Brand Placeholders

```env
NEXT_PUBLIC_APP_NAME="[PRODUCT_NAME]"
NEXT_PUBLIC_APP_TAGLINE="[TAGLINE]"
NEXT_PUBLIC_DEFAULT_LANGUAGE="id"
NEXT_PUBLIC_CHATGPT_URL="https://chatgpt.com/"
```

---

# 23. Product Principles

1. **Simple choices, powerful output**
2. **Always age appropriate**
3. **Printable first**
4. **No prompt engineering knowledge required**
5. **Mobile experience first**
6. **Fun interface, professional output**
7. **Never overwhelm the user**
8. **Prompt structure should be transparent**
9. **Output must be editable**
10. **Every generated prompt should be useful immediately**

---

# 24. North Star Metric

**Successful Prompt Copy Rate**

Formula:

```text
users who generate + copy prompt
÷
users who start generator
```

Secondary:

- generator completion rate
- average generations/session
- follow-up prompt usage
- return users
- template usage

---

# 25. One-sentence Pitch

> **[PRODUCT_NAME] helps parents, teachers, and creators turn a simple worksheet idea into a professional, child-friendly AI image prompt in seconds.**
