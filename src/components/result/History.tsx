"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppRouter } from "@/lib/navigation";
import { ArrowUpRight, Clock, Trash2 } from "lucide-react";
import { useGenerator } from "@/store/generatorStore";
export function History() {
  const s = useGenerator(),
    router = useAppRouter(),
    [confirm, setConfirm] = useState(false);
  useEffect(() => {
    s.hydrate();
  }, [s]);
  return (
    <main id="main" className="container page-main narrow-page">
      <div className="center-heading">
        <span className="section-kicker">JEJAK KREATIVITASMU</span>
        <h1>Cerita belajarnya bisa dilanjutkan.</h1>
        <p>10 seri terakhir, tersimpan di browser perangkat ini. Buka lagi saat si kecil siap belajar.</p>
      </div>
      {!s.hydrated ? (
        <p role="status">Membuka riwayat…</p>
      ) : !s.history.length ? (
        <div className="empty-state">
          <span>📚</span>
          <h2>Belum ada prompt.</h2>
          <p>Siapkan seri worksheet pertamanya. Nanti kamu bisa melanjutkannya dari sini.</p>
          <Link prefetch={false} className="button" href="/create">
            Buat prompt pertama <ArrowUpRight size={17} />
          </Link>
        </div>
      ) : (
        <>
          <div className="history-list">
            {s.history.map((item) => (
              <button
                key={item.id}
                className="history-card"
                onClick={() => {
                  s.restore(item);
                  router.push("/result");
                }}
              >
                <span className="history-icon">📄</span>
                <div>
                  <h2>{item.title}</h2>
                  <p>
                    <Clock size={13} />
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.createdAt))}{" "}
                    ·{" "}
                    {item.form.ageRange === "custom"
                      ? item.form.customAge
                      : item.form.ageRange}{" "}
                    tahun · {item.form.pageCount} lembar
                  </p>
                </div>
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
          <div className="history-clear">
            {confirm ? (
              <>
                <p>Hapus seluruh riwayat di perangkat ini?</p>
                <button
                  className="button button-small"
                  onClick={() => {
                    s.clearHistory();
                    setConfirm(false);
                  }}
                >
                  Ya, hapus riwayat
                </button>
                <button
                  className="text-button"
                  onClick={() => setConfirm(false)}
                >
                  Batal
                </button>
              </>
            ) : (
              <button className="text-button" onClick={() => setConfirm(true)}>
                <Trash2 size={16} /> Hapus riwayat
              </button>
            )}
          </div>
        </>
      )}
      {s.storageWarning && (
        <p role="status" className="storage-warning">
          Penyimpanan browser tidak tersedia. Riwayat hanya bertahan selama sesi
          ini.
        </p>
      )}
    </main>
  );
}
