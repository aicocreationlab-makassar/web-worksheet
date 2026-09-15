"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppRouter } from "@/lib/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  Pencil,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useGenerator } from "@/store/generatorStore";
import {
  activities,
  ages,
  labelOf,
  styles,
  subjects,
  themes,
} from "@/data/options";
import { templates } from "@/data/templates";
import {
  validateStep,
  WorksheetFormSchema,
  type DraftForm,
} from "@/lib/schemas/worksheet";
import {
  buildWorksheetPrompt,
  getTheme,
} from "@/lib/prompt-engine/buildPrompt";
import { getAgeRules, getTaskCount } from "@/lib/prompt-engine/ageRules";
import { track } from "@/lib/analytics";
const steps = ["Tema", "Usia", "Aktivitas", "Gaya visual", "Tinjau"];
const titles = [
  "Hari ini, mau menjelajah apa?",
  "Untuk penjelajah usia berapa?",
  "Mau belajar sambil apa?",
  "Beri sentuhan khas milikmu.",
  "Ide serumu sudah siap!",
];
const subtitles = [
  "Pilih dunia kecil yang ingin kamu bawa ke lembar belajar.",
  "Setiap usia punya cara serunya sendiri untuk belajar.",
  "Tentukan aktivitas dan tujuan belajar yang ingin dicapai.",
  "Pilih tampilan yang pas untuk si kecil dan printer-mu.",
  "Periksa pilihanmu. Kami akan merangkainya jadi prompt lengkap.",
];
export function ChoiceCard({
  selected,
  onClick,
  emoji,
  title,
  description,
  color = "cream",
}: {
  selected: boolean;
  onClick: () => void;
  emoji?: string;
  title: string;
  description?: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      className={`choice-card ${selected ? "is-selected" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {emoji && (
        <span className={`choice-emoji ${color}`} aria-hidden="true">
          {emoji}
        </span>
      )}
      <strong>{title}</strong>
      {description && <small>{description}</small>}
      {selected && (
        <span className="choice-check">
          <Check size={13} />
        </span>
      )}
    </button>
  );
}
function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function Generator() {
  const s = useGenerator(),
    router = useAppRouter(),
    params = useSearchParams(),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const initialized = useRef(false),
    heading = useRef<HTMLHeadingElement>(null),
    reduce = useReducedMotion();
  useEffect(() => {
    s.hydrate();
    if (!initialized.current) {
      const template = templates.find((t) => t.id === params.get("template"));
      if (template) {
        s.start(template.form);
        // Consume the preset once; a refresh must restore the user's edited draft.
        router.replace("/create", { scroll: false });
      }
      track("generator_started");
      initialized.current = true;
    }
  }, [params, router, s]);
  const f = s.form;
  const reviewed = s.step===4 ? WorksheetFormSchema.safeParse(f) : null;
  const update = (data: Partial<DraftForm>) => {
    s.update(data);
    setError("");
  };
  const go = (step: number) => {
    s.setStep(step);
    setError("");
    requestAnimationFrame(() => heading.current?.focus());
  };
  const next = () => {
    const e = validateStep(f, s.step);
    if (e) {
      setError(e);
      return;
    }
    track("generator_step_completed", { step: s.step + 1 });
    go(s.step + 1);
  };
  const generate = () => {
    const parsed = WorksheetFormSchema.safeParse(f);
    if (!parsed.success) {
      setError(
        "Ada pilihan yang belum lengkap. Periksa kembali langkah sebelumnya.",
      );
      return;
    }
    setBusy(true);
    try {
      const prompt = buildWorksheetPrompt(parsed.data);
      s.saveResult(
        parsed.data,
        prompt,
        `${parsed.data.childName ? parsed.data.childName + " · " : ""}${getTheme(parsed.data)} · ${labelOf(activities, parsed.data.activityType)} · ${parsed.data.pageCount} lembar`,
      );
      track("prompt_generated", { pages: parsed.data.pageCount });
      router.push("/result");
    } catch {
      setError(
        "Prompt belum berhasil dibuat. Periksa pilihanmu lalu coba lagi.",
      );
      setBusy(false);
    }
  };
  const suggested =
    f.ageRange && f.ageRange !== "custom"
      ? getAgeRules(f.ageRange).suggestedActivities
      : [];
  if (!s.hydrated)
    return (
      <main id="main" className="container page-main">
        <p role="status">Menyiapkan ruang kreativitasmu…</p>
      </main>
    );
  return (
    <main id="main" className="generator-page">
      <div className="generator-top">
        <span className="section-kicker">
          <Sparkles size={14} /> RUANG KREATIVITASMU
        </span>
        <span>Langkah {s.step + 1} dari 5</span>
      </div>
      <ol className="step-progress" aria-label="Langkah pembuatan worksheet">
        {steps.map((x, i) => (
          <li
            key={x}
            className={i === s.step ? "current" : i < s.step ? "complete" : ""}
            aria-current={i === s.step ? "step" : undefined}
          >
            <button
              disabled={i > s.step}
              onClick={() => go(i)}
              aria-label={`Langkah ${i + 1}: ${x}`}
            >
              <span>{i < s.step ? <Check size={16} /> : i + 1}</span>
              <strong>{x}</strong>
            </button>
          </li>
        ))}
      </ol>
      <div className="wizard-panel">
        <div className="wizard-heading">
          <span className="wizard-mini-label">
            {
              [
                "PILIH TEMA",
                "KENALI SI KECIL",
                "TENTUKAN AKTIVITAS",
                "SAATNYA BERKREASI",
                "SATU LANGKAH LAGI",
              ][s.step]
            }
          </span>
          <h1 ref={heading} tabIndex={-1}>
            {titles[s.step]}
          </h1>
          <p>{subtitles[s.step]}</p>
        </div>
        <motion.div
          key={s.step}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {s.step === 0 && (
            <>
              <div className="choice-grid theme-choices">
                {themes.map((t) => (
                  <ChoiceCard
                    key={t.value}
                    title={t.label}
                    emoji={t.emoji}
                    color={t.color}
                    selected={f.theme === t.value}
                    onClick={() => update({ theme: t.value })}
                  />
                ))}
              </div>
              {f.theme === "custom" && (
                <Field label="Ceritakan tema pilihanmu">
                  <input
                    maxLength={180}
                    value={f.customTheme ?? ""}
                    placeholder="Misalnya: kebun ajaib dengan kupu-kupu"
                    onChange={(e) => update({ customTheme: e.target.value })}
                  />
                </Field>
              )}
              <div className="tip">
                <Lightbulb size={18} />
                <p>
                  Ikuti rasa ingin tahu si kecil. Tema favoritnya bisa bikin
                  belajar lebih menyenangkan!
                </p>
              </div>
            </>
          )}
          {s.step === 1 && (
            <>
              <div className="choice-grid age-choices">
                {ages.map((a, i) => (
                  <ChoiceCard
                    key={a}
                    title={
                      a === "custom"
                        ? "Usia lainnya"
                        : `${a.replace("-", "–")} tahun`
                    }
                    emoji={["🌱", "🌼", "🌈", "🧭", "🚀", "✨"][i]}
                    color={
                      ["mint", "yellow", "pink", "blue", "lavender", "peach"][i]
                    }
                    description={
                      [
                        "Mulai mengeksplorasi",
                        "Siap belajar hal baru",
                        "Makin mandiri",
                        "Penuh rasa ingin tahu",
                        "Berpikir lebih jauh",
                        "Tentukan usia 3–12 tahun",
                      ][i]
                    }
                    selected={f.ageRange === a}
                    onClick={() =>
                      update({ ageRange: a, activityCount: undefined })
                    }
                  />
                ))}
              </div>
              {f.ageRange === "custom" && (
                <Field label="Usia anak (tahun)">
                  <input
                    type="number"
                    min={3}
                    max={12}
                    value={f.customAge ?? ""}
                    onChange={(e) => update({ customAge: e.target.value })}
                  />
                </Field>
              )}
              <div className="tip">
                <Lightbulb size={18} />
                <p>
                  Kami menyesuaikan panjang instruksi, ukuran gambar, dan jumlah
                  soal dengan usia yang kamu pilih.
                </p>
              </div>
            </>
          )}
          {s.step === 2 && (
            <>
              <div className="form-grid">
                <Field label="Mata pelajaran">
                  <select
                    value={f.subject}
                    onChange={(e) =>
                      update({
                        subject: e.target.value as DraftForm["subject"],
                      })
                    }
                  >
                    {subjects.map((x) => (
                      <option key={x} value={x}>
                        {x === "custom" ? "Pelajaran sendiri" : x}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Tingkat kesulitan">
                  <select
                    value={f.difficulty}
                    onChange={(e) =>
                      update({
                        difficulty: e.target.value as DraftForm["difficulty"],
                      })
                    }
                  >
                    <option value="auto">Otomatis sesuai usia</option>
                    <option value="easy">Mudah</option>
                    <option value="medium">Sedang</option>
                    <option value="challenging">Menantang</option>
                  </select>
                </Field>
              </div>
              {f.subject === "custom" && (
                <Field label="Mata pelajaran pilihanmu">
                  <input
                    maxLength={120}
                    value={f.customSubject ?? ""}
                    onChange={(e) => update({ customSubject: e.target.value })}
                  />
                </Field>
              )}
              <Field label="Tujuan belajar (opsional)">
                <input
                  maxLength={500}
                  value={f.learningObjective}
                  placeholder="Misalnya: mengenal dan menghitung angka 1–10"
                  onChange={(e) =>
                    update({ learningObjective: e.target.value })
                  }
                />
              </Field>
              <h2 className="field-heading">
                Pilih aktivitas{" "}
                <small>✦ Saran sesuai usia ditandai di bawah</small>
              </h2>
              <div className="choice-grid activity-choices">
                {activities.map((a) => (
                  <ChoiceCard
                    key={a.value}
                    title={a.label}
                    emoji={a.emoji}
                    selected={f.activityType === a.value}
                    description={
                      suggested.includes(a.value)
                        ? "✦ Cocok untuk usia ini"
                        : undefined
                    }
                    onClick={() => update({ activityType: a.value })}
                  />
                ))}
              </div>
              {f.activityType === "custom" && (
                <Field label="Jelaskan aktivitasnya">
                  <input
                    maxLength={300}
                    value={f.customActivity ?? ""}
                    onChange={(e) => update({ customActivity: e.target.value })}
                  />
                </Field>
              )}
              <div className="form-grid">
                <Field
                  label="Jumlah lembar worksheet"
                  hint="1–20 lembar. Satu gambar per lembar, lanjut dengan perintah singkat."
                >
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={Number.isNaN(f.pageCount) ? "" : f.pageCount}
                    onChange={(e) =>
                      update({
                        pageCount: e.target.value
                          ? Number(e.target.value)
                          : Number.NaN,
                      })
                    }
                  />
                </Field>
                <Field
                  label="Aktivitas per lembar (opsional)"
                  hint="Otomatis dibatasi sesuai usia agar tidak terlalu padat."
                >
                  <input
                    type="number"
                    min={1}
                    max={12}
                    placeholder="Otomatis sesuai usia"
                    value={f.activityCount ?? ""}
                    onChange={(e) =>
                      update({
                        activityCount: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </Field>
                <Field label="Objek per aktivitas (opsional)">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    placeholder="Otomatis"
                    value={f.objectCount ?? ""}
                    onChange={(e) =>
                      update({
                        objectCount: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </Field>
              </div>
            </>
          )}
          {s.step === 3 && (
            <>
              <h2 className="field-heading">Gaya ilustrasi</h2>
              <div className="choice-grid style-choices">
                {styles.map((x, i) => (
                  <ChoiceCard
                    key={x}
                    title={x === "custom" ? "Gaya sendiri" : x}
                    emoji={
                      ["🧸", "🎨", "🌸", "📖", "🍡", "◻️", "✏️", "🖍️", "✨"][i]
                    }
                    selected={f.visualStyle === x}
                    onClick={() => update({ visualStyle: x })}
                  />
                ))}
              </div>
              {f.visualStyle === "custom" && (
                <Field label="Deskripsikan gaya ilustrasi">
                  <input
                    maxLength={200}
                    value={f.customStyle ?? ""}
                    onChange={(e) => update({ customStyle: e.target.value })}
                  />
                </Field>
              )}
              <div className="form-grid">
                <Field label="Mode warna">
                  <select
                    value={f.colorMode}
                    onChange={(e) =>
                      update({
                        colorMode: e.target.value as DraftForm["colorMode"],
                      })
                    }
                  >
                    <option value="pastel">Pastel lembut</option>
                    <option value="full-color">Penuh warna</option>
                    <option value="black-white">Hitam-putih</option>
                    <option value="printer-friendly">Hemat tinta</option>
                  </select>
                </Field>
                <Field label="Ukuran kertas">
                  <select
                    value={f.paperSize}
                    onChange={(e) =>
                      update({
                        paperSize: e.target.value as DraftForm["paperSize"],
                      })
                    }
                  >
                    <option>A4</option>
                    <option>US Letter</option>
                    <option value="square">Persegi (210 × 210 mm)</option>
                    <option value="custom">Ukuran sendiri</option>
                  </select>
                </Field>
                {f.paperSize === "custom" && (
                  <Field label="Ukuran kertas khusus">
                    <input
                      maxLength={100}
                      placeholder="Contoh: 148 × 210 mm"
                      value={f.customPaperSize ?? ""}
                      onChange={(e) =>
                        update({ customPaperSize: e.target.value })
                      }
                    />
                  </Field>
                )}
                <Field label="Orientasi">
                  <select
                    value={f.orientation}
                    onChange={(e) =>
                      update({
                        orientation: e.target.value as DraftForm["orientation"],
                      })
                    }
                  >
                    <option value="portrait">Portrait (tegak)</option>
                    <option value="landscape">Landscape (mendatar)</option>
                  </select>
                </Field>
                <Field label="Bahasa worksheet">
                  <select
                    value={f.language}
                    onChange={(e) =>
                      update({ language: e.target.value as "id" | "en" })
                    }
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </Field>
                <Field label="Karakter ilustrasi">
                  <input
                    maxLength={200}
                    value={f.characterStyle}
                    onChange={(e) => update({ characterStyle: e.target.value })}
                  />
                </Field>
                <Field label="Banyaknya dekorasi">
                  <select
                    value={f.decorativeLevel}
                    onChange={(e) =>
                      update({
                        decorativeLevel: e.target
                          .value as DraftForm["decorativeLevel"],
                      })
                    }
                  >
                    <option value="minimal">Minimal</option>
                    <option value="balanced">Seimbang</option>
                    <option value="playful">Lebih ceria</option>
                  </select>
                </Field>
              </div>
              <Field
                label="Catatan tambahan (opsional)"
                hint="Ceritakan kebutuhan khusus, misalnya instruksi singkat atau area jawaban ekstra besar."
              >
                <textarea
                  rows={3}
                  maxLength={1500}
                  value={f.customNotes}
                  placeholder="Misalnya: tambahkan bintang kecil sebagai penyemangat"
                  onChange={(e) => update({ customNotes: e.target.value })}
                />
              </Field>
              <details className="personalization-panel">
                <summary>
                  <span>💛 Jadikan khusus untuk si kecil</span>
                  <span className="optional-badge">Opsional</span>
                </summary>
                <p>
                  Nama dan identitas pilihanmu akan dicetak konsisten di setiap
                  lembar. Kosongkan yang tidak diperlukan.
                </p>
                <div className="form-grid">
                  <Field label="Nama anak">
                    <input
                      autoComplete="off"
                      maxLength={80}
                      value={f.childName}
                      placeholder="Misalnya: Alya"
                      onChange={(e) => update({ childName: e.target.value })}
                    />
                  </Field>
                  <Field label="Kelas atau kelompok">
                    <input
                      autoComplete="off"
                      maxLength={80}
                      value={f.className}
                      placeholder="Misalnya: TK B"
                      onChange={(e) => update({ className: e.target.value })}
                    />
                  </Field>
                  <Field label="Sekolah atau tempat belajar">
                    <input
                      autoComplete="off"
                      maxLength={120}
                      value={f.schoolName}
                      placeholder="Misalnya: Rumah Belajar Pelangi"
                      onChange={(e) => update({ schoolName: e.target.value })}
                    />
                  </Field>
                  <Field label="Judul seri worksheet">
                    <input
                      maxLength={120}
                      value={f.worksheetTitle}
                      placeholder="Misalnya: Petualangan Laut Alya"
                      onChange={(e) =>
                        update({ worksheetTitle: e.target.value })
                      }
                    />
                  </Field>
                </div>
                <Field label="Identitas tambahan">
                  <input
                    autoComplete="off"
                    maxLength={160}
                    value={f.additionalIdentity}
                    placeholder="Misalnya: Semester 1 · Kelompok Bintang"
                    onChange={(e) =>
                      update({ additionalIdentity: e.target.value })
                    }
                  />
                </Field>
                <p className="personalization-note">
                  Tersimpan di browser ini dan ikut tersalin dalam prompt. Tidak
                  perlu akun.
                </p>
                {(f.childName ||
                  f.className ||
                  f.schoolName ||
                  f.worksheetTitle ||
                  f.additionalIdentity) && (
                  <button
                    type="button"
                    className="text-button"
                    onClick={() =>
                      update({
                        childName: "",
                        className: "",
                        schoolName: "",
                        worksheetTitle: "",
                        additionalIdentity: "",
                      })
                    }
                  >
                    Kosongkan personalisasi
                  </button>
                )}
              </details>
              {(f.activityType === "coloring" ||
                f.visualStyle === "Coloring Book") && (
                <div className="tip">
                  <Lightbulb size={18} />
                  <p>
                    Aktivitas mewarnai otomatis menggunakan garis hitam dan
                    bagian dalam putih agar siap diwarnai.
                  </p>
                </div>
              )}
            </>
          )}
          {s.step === 4 && (
            <>
              <div className="review-celebration" aria-hidden="true">
                ✨ 📄 ✨
              </div>
              <div className="review-grid">
                {[
                  {
                    title: "Tema worksheet",
                    value:
                      f.theme === "custom"
                        ? f.customTheme
                        : labelOf(themes, f.theme),
                    emoji: "🎈",
                    step: 0,
                  },
                  {
                    title: "Usia si kecil",
                    value: `${f.ageRange === "custom" ? f.customAge : f.ageRange.replace("-", "–")} tahun`,
                    emoji: "🌱",
                    step: 1,
                  },
                  {
                    title: "Aktivitas belajar",
                    value:
                      f.activityType === "custom"
                        ? f.customActivity
                        : labelOf(activities, f.activityType),
                    emoji: "🧩",
                    step: 2,
                  },
                  {
                    title: "Gaya visual",
                    value: `${f.visualStyle === "custom" ? f.customStyle : f.visualStyle} · ${{ pastel: "Pastel", "full-color": "Penuh warna", "black-white": "Hitam-putih", "printer-friendly": "Hemat tinta" }[f.colorMode]}`,
                    emoji: "🎨",
                    step: 3,
                  },
                  {
                    title: "Format cetak",
                    value: `${f.paperSize === "custom" ? f.customPaperSize : f.paperSize} · ${f.orientation}`,
                    emoji: "🖨️",
                    step: 3,
                  },
                  {
                    title: "Jumlah lembar",
                    value: `${f.pageCount} lembar · satu gambar per lembar`,
                    emoji: "📚",
                    step: 2,
                  },
                  {
                    title: "Personalisasi",
                    value:
                      [
                        f.childName,
                        f.className,
                        f.schoolName,
                        f.worksheetTitle,
                        f.additionalIdentity,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Tanpa identitas pribadi",
                    emoji: "💛",
                    step: 3,
                  },
                  {
                    title: "Bahasa worksheet",
                    value: f.language === "id" ? "Bahasa Indonesia" : "English",
                    emoji: "🌏",
                    step: 3,
                  },
                ].map((x) => (
                  <div className="review-card" key={x.title}>
                    <span aria-hidden="true">{x.emoji}</span>
                    <div>
                      <small>{x.title}</small>
                      <strong>{x.value}</strong>
                    </div>
                    <button
                      aria-label={`Edit ${x.title}`}
                      onClick={() => go(x.step)}
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="review-details">
                <p>
                  <strong>Pelajaran:</strong>{" "}
                  {f.subject === "custom" ? f.customSubject : f.subject}
                </p>
                <p>
                  <strong>Tujuan:</strong>{" "}
                  {f.learningObjective ||
                    "Otomatis berdasarkan aktivitas dan usia"}
                </p>
                <p>
                  <strong>Kesulitan:</strong>{" "}
                  {
                    {
                      auto: "Otomatis",
                      easy: "Mudah",
                      medium: "Sedang",
                      challenging: "Menantang",
                    }[f.difficulty]
                  }{" "}
                  · <strong>Jumlah aktivitas:</strong>{" "}
                  {reviewed?.success?getTaskCount(reviewed.data):(f.activityCount ?? "Otomatis sesuai usia")} per lembar{reviewed?.success&&f.activityCount&&getTaskCount(reviewed.data)<f.activityCount?' (disesuaikan usia)':''} ·{" "}
                  <strong>Objek:</strong> {f.objectCount ?? "Otomatis"}
                </p>
                <p>
                  <strong>Karakter:</strong>{" "}
                  {f.characterStyle || "Ramah dan membulat"} ·{" "}
                  <strong>Dekorasi:</strong>{" "}
                  {
                    {
                      minimal: "Minimal",
                      balanced: "Seimbang",
                      playful: "Ceria",
                    }[f.decorativeLevel]
                  }
                </p>
                {f.customNotes && (
                  <p>
                    <strong>Catatan:</strong> {f.customNotes}
                  </p>
                )}
              </div>
              <div className="tip">
                <Sparkles size={18} />
                <p>
                  Yang kamu dapatkan adalah{" "}
                  <strong>
                    prompt untuk {f.pageCount} lembar yang saling terhubung
                  </strong>
                  . Salin sekali ke ChatGPT untuk membuat gambar 1.
                  {f.pageCount > 1 && (
                    <>
                      {" "}
                      Setelah itu, cukup ketik{" "}
                      <strong>“lanjut gambar 2”</strong> di chat yang sama.
                    </>
                  )}
                </p>
              </div>
            </>
          )}
        </motion.div>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        {s.storageWarning && (
          <p className="storage-warning" role="status">
            Penyimpanan browser tidak tersedia. Kamu tetap bisa membuat dan
            mengunduh prompt, tetapi draf mungkin hilang saat halaman ditutup.
          </p>
        )}
        <div className="wizard-actions">
          <button
            className="text-button"
            disabled={s.step === 0 || busy}
            onClick={() => go(s.step - 1)}
          >
            <ArrowLeft size={17} /> Kembali
          </button>
          <span className="autosave-label">
            {s.storageWarning ? "Draf sementara" : "Draf tersimpan otomatis"}
          </span>
          {s.step < 4 ? (
            <button className="button" onClick={next}>
              Lanjutkan <ArrowRight size={18} />
            </button>
          ) : (
            <button className="button" disabled={busy} onClick={generate}>
              <WandSparkles size={18} />
              {busy ? "Menyiapkan seri…" : "Siapkan worksheet-ku"}
              <Sparkles size={16} />
            </button>
          )}
        </div>
      </div>
      <p className="generator-footnote">
        Dibuat dengan rasa ingin tahu. Dirangkai dengan perhatian.{" "}
        <span>♡</span>
      </p>
    </main>
  );
}
