"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { templates } from "@/data/templates";
import { TemplateCard } from "./TemplateCard";
export function TemplateBrowser() {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("Semua");
  const found = templates.filter(
    (t) =>
      (category === "Semua" || t.category === category) &&
      `${t.title} ${t.description} ${t.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="template-tools">
        <div className="search-input">
          <Search size={18} />
          <input
            aria-label="Cari template"
            placeholder="Cari inspirasi worksheet..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button aria-label="Hapus pencarian" onClick={() => setQuery("")}>
              <X size={17} />
            </button>
          )}
        </div>
        <div className="filter-chips" aria-label="Kategori template">
          {[
            "Semua",
            "Berhitung",
            "Menulis",
            "Mencocokkan",
            "Mewarnai",
            "Logika",
            "Bahasa",
          ].map((x) => (
            <button
              key={x}
              aria-pressed={category === x}
              className={category === x ? "selected" : ""}
              onClick={() => setCategory(x)}
            >
              {x}
            </button>
          ))}
        </div>
      </div>
      <p className="results-count" aria-live="polite">
        {found.length} template untuk ide belajarmu
      </p>
      <div className="template-grid">
        {found.map((t) => (
          <TemplateCard key={t.id} template={t} />
        ))}
      </div>
      {!found.length && (
        <div className="empty-state">
          <span>🔍</span>
          <h2>Belum ketemu yang pas.</h2>
          <p>Coba kata lain atau lihat semua inspirasi.</p>
          <button
            className="button"
            onClick={() => {
              setQuery("");
              setCategory("Semua");
            }}
          >
            Lihat semua template
          </button>
        </div>
      )}
    </>
  );
}
