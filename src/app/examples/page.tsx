import type { Metadata } from "next";
import { TemplateCard } from "@/components/landing/TemplateCard";
import { templates } from "@/data/templates";
import { buildWorksheetPrompt } from "@/lib/prompt-engine/buildPrompt";
export const metadata: Metadata = { title: "Contoh worksheet dan prompt" };
export default function Page() {
  return (
    <main id="main" className="container page-main">
      <div className="center-heading">
        <span className="section-kicker">SEDIKIT INSPIRASI UNTUKMU</span>
        <h1>Intip ide, temukan kemungkinan.</h1>
        <p>
          Lihat ilustrasi aktivitas dan contoh prompt lengkapnya. Pilih kartu
          untuk menyesuaikan.
        </p>
      </div>
      <div className="examples-grid">
        {templates.slice(0, 4).map((t) => (
          <div key={t.id}>
            <TemplateCard template={t} />
            <details className="example-prompt">
              <summary>Lihat contoh prompt</summary>
              <pre>{buildWorksheetPrompt(t.form)}</pre>
            </details>
          </div>
        ))}
      </div>
      <p className="preview-note">
        Pratinjau adalah ilustrasi aktivitas, bukan hasil AI. Hasil akhir
        bergantung pada layanan pembuat gambar yang digunakan.
      </p>
    </main>
  );
}
