import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { WorksheetTemplate } from "@/data/templates";
import { WorksheetArt } from "@/components/ui/WorksheetArt";
export function TemplateCard({ template: t }: { template: WorksheetTemplate }) {
  return (
    <Link
      prefetch={false}
      href={`/create?template=${t.id}`}
      className="template-card"
    >
      <div className={`template-preview ${t.color}`}>
        <span className="age-badge">
          {t.form.ageRange.replace("-", "–")} tahun
        </span>
        <div className="template-sheet">
          <WorksheetArt variant={t.form.theme} mini />
        </div>
        <span className="template-sticker" aria-hidden="true">
          {t.emoji}
        </span>
      </div>
      <div className="template-info">
        <span className="template-category">{t.category}</span>
        <h3>
          {t.title}
          <ArrowUpRight size={18} />
        </h3>
        <p>{t.description}</p>
      </div>
    </Link>
  );
}
