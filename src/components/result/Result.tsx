"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppRouter } from "@/lib/navigation";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Pencil,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useGenerator } from "@/store/generatorStore";
import {
  buildWorksheetPrompt,
  getTheme,
} from "@/lib/prompt-engine/buildPrompt";
import { getFollowups } from "@/lib/prompt-engine/followupPrompts";
import { track } from "@/lib/analytics";
import { SeriesContinuation } from "./SeriesContinuation";
export async function copyText(value: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      /* Fall back to a selectable temporary field. */
    }
  }
  const previous = document.activeElement as HTMLElement | null;
  const el = document.createElement("textarea");
  el.value = value;
  el.style.position = "fixed";
  el.style.opacity = "0";
  document.body.append(el);
  el.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    el.remove();
    previous?.focus();
  }
  if (!copied) throw new Error("clipboard unavailable");
}
export function Result() {
  const s = useGenerator(),
    [toast, setToast] = useState(""),
    [copyError, setCopyError] = useState(""),
    [copied, setCopied] = useState(false),
    router = useAppRouter();
  useEffect(() => {
    s.hydrate();
  }, [s]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast("");
      setCopied(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  const copy = async (text: string, followup = false) => {
    try {
      await copyText(text);
      setCopyError("");
      setToast(
        followup
          ? "Prompt lanjutan tersalin. Tempel di percakapan yang sama."
          : "Prompt tersalin! Tempel di ChatGPT, ya.",
      );
      if (!followup) setCopied(true);
      track(followup ? "followup_copied" : "prompt_copied");
    } catch {
      setCopyError(
        "Penyalinan otomatis tidak tersedia. Pilih teks prompt, lalu tekan Ctrl+C atau gunakan menu Salin di perangkatmu.",
      );
    }
  };
  if (!s.hydrated)
    return (
      <main id="main" className="container page-main">
        <p role="status">Membuka prompt-mu…</p>
      </main>
    );
  if (!s.resultForm)
    return (
      <main id="main" className="container page-main empty-state">
        <span>🌱</span>
        <h1>Ide serumu dimulai di sini.</h1>
        <p>Belum ada prompt. Pilih tema favorit dan buat prompt pertamamu.</p>
        <Link prefetch={false} className="button" href="/create">
          Buat prompt worksheet <ArrowUpRight size={18} />
        </Link>
      </main>
    );
  const form = s.resultForm,
    followups = getFollowups(form),
    sections = s.prompt.split(/\n\s*\n/).map((block) => {
      const [title, ...rest] = block.split("\n");
      return { title, content: rest.join("\n") };
    });
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([s.prompt], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `lembarceria-${form.theme}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <main id="main" className="container page-main result-page">
      <div className="center-heading">
        <span className="success-badge">
          <CheckCircle2 size={16} /> SERI BELAJARMU SIAP DIMULAI
        </span>
        <h1>
          {form.childName
            ? `Dibuat khusus untuk ${form.childName}.`
            : "Satu ide. Satu seri penuh cerita."}{" "}
          <span>✦</span>
        </h1>
        <p>
          {form.pageCount} lembar bertema {getTheme(form).toLowerCase()},
          dirangkai untuk usia{" "}
          {form.ageRange === "custom"
            ? form.customAge
            : form.ageRange.replace("-", "–")}{" "}
          tahun. Mulai dari gambar pertama, lalu lanjutkan satu per satu.
        </p>
      </div>
      {form.pageCount > 1 && (
        <nav className="result-shortcuts" aria-label="Akses cepat worksheet">
          <a href="#prompt-awal">1. Prompt awal</a>
          <a href="#lanjut-seri">
            2. Lanjut gambar <ArrowUpRight size={16} />
          </a>
        </nav>
      )}
      <div className="result-workflow" aria-label="Cara memakai prompt">
        <div>
          <b>1</b>
          <span>
            <strong>Salin prompt awal</strong>
            <small>Sudah memuat rencana seluruh seri.</small>
          </span>
        </div>
        <div>
          <b>2</b>
          <span>
            <strong>Buat gambar 1 di ChatGPT</strong>
            <small>Tempel di chat baru dan kirim.</small>
          </span>
        </div>
        <div>
          <b>3</b>
          <span>
            <strong>
              {form.pageCount > 1
                ? "Ketik “gambar 2”"
                : "Periksa, unduh, dan cetak"}
            </strong>
            <small>
              {form.pageCount > 1
                ? "Lanjutkan di percakapan yang sama."
                : "Nikmati waktu belajar bersama."}
            </small>
          </span>
        </div>
      </div>
      <div className="result-layout">
        <div>
          <section className="prompt-card" id="prompt-awal">
            <div className="prompt-card-header">
              <div>
                <Sparkles size={19} />
                <h2>Mulai dari gambar 1</h2>
              </div>
              <span>
                <Pencil size={13} /> Bisa kamu edit
              </span>
            </div>
            <div className="prompt-chips">
              <span>{form.pageCount} lembar</span>
              <span>{getTheme(form)}</span>
              <span>
                {form.ageRange === "custom" ? form.customAge : form.ageRange}{" "}
                tahun
              </span>
              <span>
                {form.visualStyle === "custom"
                  ? form.customStyle
                  : form.visualStyle}
              </span>
              <span>
                {form.paperSize === "custom"
                  ? form.customPaperSize
                  : form.paperSize}
              </span>
              {form.childName && <span>Untuk {form.childName}</span>}
            </div>
            <p className="prompt-explainer">
              Salin prompt ini sekali. AI diminta membuat satu lembar terlebih
              dahulu, lalu menunggu perintahmu.
            </p>
            <label className="sr-only" htmlFor="prompt-editor">
              Edit prompt worksheet
            </label>
            <textarea
              id="prompt-editor"
              spellCheck={false}
              maxLength={30000}
              value={s.prompt}
              onChange={(e) => s.editPrompt(e.target.value)}
            />
            <div className="prompt-card-actions">
              <span>{s.prompt.length.toLocaleString("id-ID")} karakter</span>
              <button
                className="text-button"
                disabled={!s.prompt.trim()}
                onClick={download}
              >
                <Download size={16} /> Unduh .txt
              </button>
              <button
                className="button button-small"
                disabled={!s.prompt.trim()}
                onClick={() => copy(s.prompt)}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
                {copied ? "Tersalin!" : "Salin prompt"}
              </button>
            </div>
          </section>
          {copyError && (
            <p className="error-message" role="alert">
              {copyError}
            </p>
          )}
          {s.storageWarning && (
            <p className="storage-warning">
              Riwayat tidak bisa disimpan di browser ini. Unduh prompt agar
              tetap tersimpan.
            </p>
          )}
          <details className="breakdown">
            <summary>
              <span>🧩 Resep di balik prompt-mu</span>
              <ChevronDown size={18} />
            </summary>
            <p className="breakdown-intro">
              Struktur mengikuti isi editor di atas, termasuk perubahanmu.
            </p>
            {sections.map((section, i) => (
              <div key={i}>
                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </div>
            ))}
          </details>
          <div className="result-secondary">
            <button
              className="text-button"
              onClick={() => {
                s.setStep(4);
                router.push("/create");
              }}
            >
              <Pencil size={16} /> Edit pilihan
            </button>
            <button
              className="text-button"
              onClick={() => {
                s.editPrompt(buildWorksheetPrompt(form));
                setToast("Prompt dikembalikan dari pilihan awal.");
              }}
            >
              <RotateCcw size={16} /> Pulihkan prompt
            </button>
            <button
              className="text-button"
              onClick={() => {
                s.start();
                router.push("/create");
              }}
            >
              Buat baru <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        <aside className="result-guide">
          <span className="guide-emoji" aria-hidden="true">
            🪄
          </span>
          <h2>Temani belajarnya, kami bantu persiapannya.</h2>
          <p>Prompt-nya siap. Sekarang wujudkan lembar pertamanya:</p>
          <ol>
            <li>Salin prompt worksheet-mu.</li>
            <li>Buka ChatGPT dan mulai chat baru.</li>
            <li>Tempel prompt dan kirim untuk membuat gambar 1.</li>
            <li>Periksa tulisan, objek, dan aktivitasnya.</li>
            <li>
              {form.pageCount > 1
                ? "Ketik “gambar 2” untuk lembar berikutnya."
                : "Gunakan saran perbaikan jika perlu."}
            </li>
            <li>Unduh gambar dan cetak hasilnya.</li>
          </ol>
          <a
            className="button"
            href="https://chatgpt.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("open_chatgpt_clicked")}
          >
            Buka ChatGPT <ExternalLink size={16} />
          </a>
          <Link prefetch={false} href="/how-it-works" className="guide-link">
            Lihat panduan lengkap <ArrowUpRight size={14} />
          </Link>
          <small>
            Bahasa dan identitas di worksheet mengikuti pilihanmu. Gunakan chat
            yang sama untuk menjaga kesinambungan seri.
          </small>
        </aside>
      </div>
      <SeriesContinuation form={form} onCopy={copy} />
      <section className="followup-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">LANJUTKAN KREATIVITASNYA</span>
            <h2>Sedikit sentuhan, makin cocok untuknya.</h2>
            <p>
              Perbaiki lembar yang sedang dibuka tanpa berpindah ke gambar
              berikutnya.
            </p>
          </div>
        </div>
        <div className="followup-grid">
          {followups.map((x) => (
            <button
              className="followup-card"
              key={x.title}
              onClick={() => copy(x.prompt, true)}
            >
              <span aria-hidden="true">{x.icon}</span>
              <div>
                <h3>{x.title}</h3>
                <p>{x.description}</p>
              </div>
              <Copy size={17} />
            </button>
          ))}
        </div>
      </section>
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <CheckCircle2 size={18} />
            {toast}
          </>
        )}
      </div>
    </main>
  );
}
