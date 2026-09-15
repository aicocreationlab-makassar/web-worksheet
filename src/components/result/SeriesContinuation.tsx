"use client";
import { Copy, ArrowRight, Layers, ChevronDown } from "lucide-react";
import type { WorksheetForm } from "@/lib/schemas/worksheet";
import { useGenerator } from "@/store/generatorStore";
import {
  getContinuationCommand,
  getSeriesPlan,
} from "@/lib/prompt-engine/seriesRules";
import { buildContinuationPrompt } from "@/lib/prompt-engine/buildPrompt";

export function SeriesContinuation({
  form,
  onCopy,
}: {
  form: WorksheetForm;
  onCopy: (text: string, followup?: boolean) => void;
}) {
  const { continuationPage, setContinuationPage } = useGenerator();
  const plan = getSeriesPlan(form);
  if (form.pageCount === 1)
    return (
      <section className="single-page-note">
        <Layers size={21} />
        <div>
          <h2>Satu lembar, satu momen belajar.</h2>
          <p>
            Untuk membuat satu seri, buka Edit pilihan dan tambahkan jumlah
            lembar. Salin ulang prompt awalnya sebelum memulai seri baru.
          </p>
        </div>
      </section>
    );
  const page = Math.min(Math.max(2, continuationPage), form.pageCount),
    command = getContinuationCommand(page),
    current = plan[page - 1];
  return (
    <section
      className="continuation-panel"
      id="lanjut-seri"
      aria-labelledby="continuation-heading"
    >
      <div className="continuation-intro">
        <span className="section-kicker">GAMBAR PERTAMA SUDAH JADI?</span>
        <h2 id="continuation-heading">
          Lembar berikutnya, tinggal bilang lanjut.
        </h2>
        <p>
          Di percakapan ChatGPT yang sama, ketik perintah ini. Gambar berikutnya
          memakai tema, gaya, dan identitas yang sudah kamu pilih.
        </p>
      </div>
      <div className="continuation-controls">
        <label htmlFor="next-page">
          Mau membuat gambar berapa?
          <select
            id="next-page"
            value={page}
            onChange={(e) => setContinuationPage(Number(e.target.value))}
          >
            {plan.slice(1).map((p) => (
              <option key={p.number} value={p.number}>
                Gambar {p.number} dari {form.pageCount}
              </option>
            ))}
          </select>
        </label>
        <div className="command-box">
          <code>{command}</code>
          <button
            className="button button-small"
            onClick={() => onCopy(command, true)}
          >
            <Copy size={15} /> Salin perintah
          </button>
        </div>
      </div>
      <div className="page-focus">
        <span className="page-number-badge">{page}</span>
        <div>
          <strong>{current.title}</strong>
          <p>{current.focus}</p>
        </div>
        {page < form.pageCount && (
          <button
            className="text-button"
            onClick={() => setContinuationPage(page + 1)}
            aria-label={`Pilih gambar ${page + 1}`}
          >
            <ArrowRight size={17} />
          </button>
        )}
      </div>
      <details className="series-plan">
        <summary>
          Lihat rencana {form.pageCount} lembar <ChevronDown size={16} />
        </summary>
        <ol>
          {plan.map((p) => (
            <li key={p.number}>
              <span>{p.number}</span>
              <div>
                <strong>{p.title}</strong>
                <p>{p.focus}</p>
              </div>
            </li>
          ))}
        </ol>
        <p>
          Ini rencana latihan, bukan penanda gambar yang sudah dibuat. Gambar
          dihasilkan di ChatGPT.
        </p>
      </details>
      <details className="continuation-advanced">
        <summary>
          Butuh instruksi lanjutan yang lebih lengkap? <ChevronDown size={16} />
        </summary>
        <p>
          Gunakan jika AI mulai mengubah gaya atau identitas. Instruksi ini
          menyertakan kembali pengaturan seri dan fokus gambar {page}. Jika
          pindah chat, lampirkan gambar sebelumnya sebagai referensi.
        </p>
        <button
          className="text-button"
          onClick={() => onCopy(buildContinuationPrompt(form, page), true)}
        >
          <Copy size={15} /> Salin instruksi lengkap gambar {page}
        </button>
        <label className="field">
          <span>Instruksi lengkap (bisa dipilih untuk salin manual)</span>
          <textarea
            readOnly
            rows={5}
            value={buildContinuationPrompt(form, page)}
          />
        </label>
        <small>
          Disusun dari pilihan awal. Bila kamu mengedit prompt utama, sesuaikan
          juga instruksi lanjutan ini.
        </small>
      </details>
    </section>
  );
}
