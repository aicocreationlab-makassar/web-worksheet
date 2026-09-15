"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  Download,
  Smartphone,
  WifiOff,
  X,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type PWAState = { ready: boolean; installed: boolean; install: () => void };
const PWAContext = createContext<PWAState>({
  ready: false,
  installed: false,
  install: () => {},
});
export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false),
    [installed, setInstalled] = useState(false),
    [offline, setOffline] = useState(false),
    [waiting, setWaiting] = useState<ServiceWorker | null>(null),
    [installEvent, setInstallEvent] = useState<InstallEvent | null>(null),
    [installMessage, setInstallMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null),
    reload = useRef(false);
  useEffect(() => {
    const sync = () => {
      setOffline(!navigator.onLine);
      setInstalled(
        window.matchMedia("(display-mode: standalone)").matches ||
          Boolean(
            (navigator as Navigator & { standalone?: boolean }).standalone,
          ),
      );
    };
    const prompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    const appInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
      setInstallMessage(
        "Lembarceria sudah terpasang. Sampai jumpa di layar utama!",
      );
    };
    const offlineNavigation = (event: MouseEvent) => {
      if (
        navigator.onLine ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element)?.closest?.("a");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      const url = new URL(anchor.href);
      if (
        url.origin === location.origin &&
        url.pathname !== location.pathname
      ) {
        event.preventDefault();
        event.stopPropagation();
        location.assign(url.href);
      }
    };
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    window.addEventListener("beforeinstallprompt", prompt);
    window.addEventListener("appinstalled", appInstalled);
    document.addEventListener("click", offlineNavigation, true);
    let cancelled = false,
      started = false;
    const register = async () => {
      if (
        !("serviceWorker" in navigator) ||
        !window.isSecureContext ||
        process.env.NODE_ENV !== "production"
      )
        return;
      if (started) return;
      started = true;
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        if (cancelled) return;
        if (registration.waiting) setWaiting(registration.waiting);
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          worker?.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller
            )
              setWaiting(worker);
          });
        });
        await navigator.serviceWorker.ready;
        if (!cancelled) setReady(true);
      } catch {
        /* The online app remains usable if a browser blocks service workers. */
      }
    };
    const timer = window.setTimeout(register, 8000);
    document.addEventListener("pointerdown", register, { once: true });
    document.addEventListener("keydown", register, { once: true });
    const controllerChanged = () => {
      if (reload.current) location.reload();
    };
    navigator.serviceWorker?.addEventListener(
      "controllerchange",
      controllerChanged,
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("pointerdown", register);
      document.removeEventListener("keydown", register);
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
      window.removeEventListener("beforeinstallprompt", prompt);
      window.removeEventListener("appinstalled", appInstalled);
      document.removeEventListener("click", offlineNavigation, true);
      navigator.serviceWorker?.removeEventListener(
        "controllerchange",
        controllerChanged,
      );
    };
  }, []);
  const install = async () => {
    if (installed) {
      setInstallMessage("Lembarceria sudah terpasang di perangkat ini.");
      dialog.current?.showModal();
      return;
    }
    if (installEvent) {
      try {
        await installEvent.prompt();
        const choice = await installEvent.userChoice;
        if (choice.outcome === "accepted")
          setInstallMessage(
            "Ikuti konfirmasi browser untuk menyelesaikan pemasangan.",
          );
        setInstallEvent(null);
        return;
      } catch {
        setInstallEvent(null);
      }
    }
    setInstallMessage("");
    dialog.current?.showModal();
  };
  return (
    <PWAContext.Provider value={{ ready, installed, install }}>
      {offline && (
        <div className="offline-status" role="status">
          <WifiOff size={15} />
          {ready
            ? "Kamu sedang offline. Tetap bisa merangkai prompt; buka ChatGPT saat tersambung lagi."
            : "Kamu sedang offline. Halaman yang tersedia bergantung pada cache perangkat ini."}
        </div>
      )}
      {children}
      {waiting && (
        <div className="update-banner" role="status">
          <span>Versi baru Lembarceria siap.</span>
          <button
            onClick={() => {
              reload.current = true;
              waiting.postMessage({ type: "SKIP_WAITING" });
            }}
          >
            <RefreshCw size={14} /> Perbarui
          </button>
          <button aria-label="Nanti saja" onClick={() => setWaiting(null)}>
            <X size={15} />
          </button>
        </div>
      )}
      <dialog
        ref={dialog}
        className="install-dialog"
        aria-labelledby="install-heading"
      >
        <div className="install-dialog-top">
          <span className="install-illustration">📒</span>
          <button
            className="icon-button"
            aria-label="Tutup panduan pemasangan"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <span className="section-kicker">TEMAN BELAJAR DI LAYAR UTAMA</span>
        <h2 id="install-heading">Satu ketukan, ide belajar baru.</h2>
        {installMessage ? (
          <p role="status">{installMessage}</p>
        ) : (
          <>
            <p>
              Pasang Lembarceria untuk membuka generator dan riwayat langsung
              dari perangkatmu.
            </p>
            <ol>
              <li>
                <strong>Android / desktop:</strong> buka menu browser, lalu
                pilih “Pasang aplikasi” atau “Tambahkan ke layar utama”.
              </li>
              <li>
                <strong>iPhone / iPad:</strong> buka menu Bagikan, pilih “Tambah
                ke Layar Utama”, lalu konfirmasi Tambah.
              </li>
            </ol>
            <p className="install-note">
              {ready
                ? "Aplikasi siap dipakai offline untuk menyusun prompt."
                : "Buka sekali saat online agar halaman dan fitur tersimpan untuk penggunaan offline."}{" "}
              Pembuatan gambar di ChatGPT membutuhkan internet.
            </p>
          </>
        )}
        <button className="button" onClick={() => dialog.current?.close()}>
          Mengerti <CheckCircle2 size={17} />
        </button>
      </dialog>
    </PWAContext.Provider>
  );
}
export function InstallCard() {
  const { ready, installed, install } = useContext(PWAContext);
  return (
    <section className="container install-card">
      <span className="install-card-icon">
        <Smartphone size={32} />
      </span>
      <div>
        <span className="section-kicker">SELALU DEKAT SAAT IDE DATANG</span>
        <h2>Ruang kreativitas, di layar utamamu.</h2>
        <p>
          {ready
            ? "Generator dan riwayat siap dibuka tanpa internet."
            : "Pasang Lembarceria. Setelah tersimpan, rangkai prompt juga saat offline."}{" "}
          Membuat gambar di ChatGPT tetap perlu internet.
        </p>
      </div>
      <button className="button button-small" onClick={install}>
        {installed ? <CheckCircle2 size={16} /> : <Download size={16} />}{" "}
        {installed ? "Sudah terpasang" : "Pasang aplikasi"}
      </button>
    </section>
  );
}
